$files = Get-ChildItem -File -Filter *.html

$files | Foreach-Object{
    . $_.FullName
}