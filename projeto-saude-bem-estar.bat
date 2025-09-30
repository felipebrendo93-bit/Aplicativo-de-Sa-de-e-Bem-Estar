@echo off
REM Define o título da janela do console para fácil identificação
title Executando Projeto Saúde e Bem-Estar

REM Muda o diretório atual para a pasta onde o seu projeto está localizado.
REM O comando "cd /d" é usado para garantir que a unidade de disco também seja trocada, se necessário.
REM As aspas duplas são ESSENCIAIS porque o caminho contém espaços.
cd /d "C:\Users\Danilo Rocha\Desktop\Softex Cecine UFPE\Projeto\projeto-saude-bem-estar"

REM Mensagem para informar ao usuário que o script está sendo executado
echo Executando o arquivo node app.js na pasta:
echo %cd%
echo.

REM Executa o comando node para rodar o seu script JavaScript
node app.js

REM O comando "pause" mantém a janela do console aberta após a execução do script,
REM permitindo que você veja a saída ou qualquer mensagem de erro.
echo.
pause