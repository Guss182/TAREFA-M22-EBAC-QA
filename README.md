## Observações sobre o ambiente (EBAC Store)

A loja de testes disponibilizada pela EBAC possui um cookie que alterna a versão do site (cookie V2).  
Durante a execução dos exercícios dos módulos 22 e 23, ao definir o cookie `ebacStoreVersion=v2`, 
o ambiente apresentava falhas de renderização e ficava inutilizável para continuar os testes.

Por esse motivo, os cenários foram implementados e validados utilizando a versão padrão do site (sem aplicar o cookie V2),
conforme orientação da IA de suporte da EBAC (Amigobô).
