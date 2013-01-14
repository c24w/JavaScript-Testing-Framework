@echo off
:: submodules behave strangely, may want to revert to wiki_setup.bat with wiki_pull.bat
call git submodule init
call git submodule update
cd %~dp0wiki
call git checkout master