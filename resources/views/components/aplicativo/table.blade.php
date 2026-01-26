<table id="table-description" align="center" style="margin-left:auto;margin-right:auto; border-collapse: collapse;{{ $tableStyle  }}">
    <thead>
        <tr rowspan="{{ $headers->rowSpan }}" style="{{ $headers->style }}">
            @foreach($headers->columns as $headerColumn)
                <th colspan="{{ $headerColumn->colSpan  }}" style="padding:8px; border-bottom:1px solid #555;{{ $headerColumn->style  }}">{{ $headerColumn->content  }}</th>
            @endforeach
        </tr>
    </thead>
    <tbody>
    @foreach($tableData as $row)
        <tr rowspan="{{$row->rowSpan}}" style="{{$row->style ?? ''}}">
            @foreach($row->columns as $column)
                <td class="{{$column->class}}" style="{{$column->style}}" colspan="{{$column->colSpan}}"><?php echo $column->content ?></td>
            @endforeach
        </tr>
    @endforeach
    </tbody>
</table>

