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

            $this->info("Processing user: {$username}");

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
                'subscribe_to_card_when_commenting' => true, // Point 2 says false then true, using true as it's the last one
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
                $plankaDb->table('user_account')
                    ->where('id', $plankaUser->id)
                    ->update($userData);
                $userId = $plankaUser->id;
                $this->info("Updated user: {$username} (ID: {$userId})");
            } else {
                $userData['created_at'] = $now;
                // Planka might need a password even if SSO, but instruction didn't specify.
                // SyncUsersToPlanka uses str()->random(32).
                $userData['password'] = password_hash(str()->random(32), PASSWORD_DEFAULT);

                $userId = $plankaDb->table('user_account')->insertGetId($userData);
                $this->info("Inserted user: {$username} (ID: {$userId})");
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
                    'updated_at' => $now, // usually good practice even if not explicitly asked
                ]);
                $this->info("Added membership for user: {$username} to board: {$defaultBoard}");
            } else {
                $this->info("Membership already exists for user: {$username}");
            }
        }

        return self::SUCCESS;
    }
}
