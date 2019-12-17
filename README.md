Table NumCal
==
```
Author : Yugeta.Koji
Date   : 2019.12.16
```

# Summary
Tableタグ構成の数値マトリクスデータをエクセルのセル操作のように、わかり易くセルを選択したり、選択したセルの値の合計値を表示できるようにする。
セル選択には、行選択、列選択も可能にして、利便性を上げる。

# Version
ver 0.1 : base-system

# Functions
- tableセルのクリックで「セル選択モード」
- セル上をドラッグして「複数選択モード「
- Shiftキーを押して選択できる「一括選択モード」

# Howto
- 処理対象のページのHTMLにscriptタグを設置するだけ（自動起動されます）
```
<script src='table_numcal/src/table_numcal.js'></script>
```

# View capture


# Request
- ctlを押しながら選択（セル個別選択）tableをまたがっての選択が可能
- 行、列の一括選択 -> tableの1行目がthセルの場合、以下の列を選択する。(この場合、thead,tbodyが切り替わるケースがあるため、要仕様検討)
- 合計値を平均値に切り替えられるようにする。

# Issue
- 選択モード中に別のtableセルを選択したらエラーになってしまう問題 (fix : 2019.12.17)
- 同じtable内でtbody(thead,tfoot)をまたがる際にエラーになる問題 -> tbodyが別の場合は対象外とする (fix : 2019.12.17)
- table外を選択したときに、合計値表示ウィンドウ（エレメント）を閉じる (fix : 2019.12.17)

# Author-info
- Company : http://myntinc.com
- Blog    : http://wordpress.ideacompo.com/
- Barth   : 1972.03.01
