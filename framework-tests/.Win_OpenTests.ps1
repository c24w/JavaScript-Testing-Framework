$files = Get-ChildItem -Filter *.html

$files | Foreach-Object{
    . $_.FullName
}