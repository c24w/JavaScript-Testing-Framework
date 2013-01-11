@echo off
mkdir %~dp0wiki
cd %~dp0wiki
call git init
call git remote add origin git://github.com/c24w/JavaScript-Testing-Framework.wiki.git
call %~dp0wiki_pull.bat