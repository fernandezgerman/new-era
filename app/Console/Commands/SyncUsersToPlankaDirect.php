<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncUsersToPlankaDirect extends Command
{
    protected $signature = 'planka:sync-users-direct {--dry-run}';
    protected $description = 'Sincroniza usuarios de Laravel hacia Planka conectando directamente a Postgres';

    public function handle(): int
    {
        $defaultProject = config('planka.default_project');
        $defaultBoard = config('planka.default_board');

        if (!$defaultProject || !$defaultBoard) {
            $this->error('PLANKA_DEFAULT_PROJECT or PLANKA_DEFAULT_BOARD not configured.');
            return self::FAILURE;
        }

        $plankaDb = DB::connection('planka');

        try {
            $plankaDb->getPdo();
        } catch (\Exception $e) {
            $this->error("Could not connect to Planka database: " . $e->getMessage());
            return self::FAILURE;
        }

        $users = User::query()
            ->where('activo', 1)
            ->get();

        $this->info("Users to sync: {$users->count()}");

        // Get terms_signature from the first record in user_account
        $firstPlankaUser = $plankaDb->table('user_account')->first();
        $termsSignature = $firstPlankaUser ? $firstPlankaUser->terms_signature : null;

        foreach ($users as $user) {
            $username = $user->usuario;
            $email = $username . '@newerakioscos.com';

            $plankaUser = $plankaDb->table('user_account')
                ->where('username', $username)
                ->first();

            $now = now();

            $userData = [
                'email' => $email,
                'role' => 'boardUser',
                'name' => $user->nombre_completo ?? $username,
                'username' => $username,
                'language' => 'es-ES',
                'subscribe_to_own_cards' => false,
                'subscribe_to_card_when_commenting' => true,
                'turn_off_recent_card_highlighting' => false,
                'enable_favorites_by_default' => true,
                'default_editor_mode' => 'wysiwyg',
                'default_home_view' => 'gridProjects',
                'default_projects_order' => 'byDefault',
                'is_sso_user' => true,
                'is_deactivated' => false,
                'updated_at' => $now,
                'terms_signature' => $termsSignature,
                'terms_accepted_at' => $now,
            ];

            if ($this->option('dry-run')) {
                $this->line("[dry-run] Would sync user: {$username}");
                continue;
            }

            if ($plankaUser) {
               /* $plankaDb->table('user_account')
                    ->where('id', $plankaUser->id)
                    ->update($userData);*/
                $userId = $plankaUser->id;
                // As per requirement: "does not show users when already exists, only notify the changes in db"
                // But the user account update might be considered a change if we wanted to be strict.
                // However, the prompt says "does not show users when already exists", usually meaning if it's already there, don't spam.
                // I'll skip the "Updated user" message to comply with "does not show users when already exists".
            } else {
                $userData['created_at'] = $now;
                $userData['password'] = password_hash(str()->random(32), PASSWORD_DEFAULT);

                $userId = $plankaDb->table('user_account')->insertGetId($userData);
                $this->info("Inserted user: {$username} into user_account (ID: {$userId})");
            }

            // Identity Provider User Sync
            $idpUser = $plankaDb->table('identity_provider_user')
                ->where('user_id', $userId)
                ->first();

            if (!$idpUser) {
                $plankaDb->table('identity_provider_user')->insert([
                    'user_id' => $userId,
                    'issuer' => 'https://newerakioscos.com',
                    'sub' => (string) $user->id,
                    'created_at' => $now,
                    'updated_at' => null,
                ]);
                $this->info("Inserted identity provider record for user: {$username}");
            }

            // Also, for each user add a record into board_membership
            $membershipExists = $plankaDb->table('board_membership')
                ->where('board_id', $defaultBoard)
                ->where('user_id', $userId)
                ->exists();

            if (!$membershipExists) {
                $plankaDb->table('board_membership')->insert([
                    'project_id' => $defaultProject,
                    'board_id' => $defaultBoard,
                    'user_id' => $userId,
                    'role' => 'editor',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $this->info("Added membership for user: {$username} to board: {$defaultBoard}");
            }
        }

        return self::SUCCESS;
    }
}
