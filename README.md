# euclidsJS
Versão web para os livros "elementos" do matemático grego Euclides, além de uma biblioteca javascript que desenha em elementos canvas  simulando régua e compasso gregos.

## Motivação
O desenvolvimento desta página em conjunto com a biblioteca Javascript foi iniciado para estudar e aplicar o livro Elementos, do matemático grego euclides. Este que é considerado o primeiro tratado geométrico da história, tem como base um pensamento lógico extremamente desenvolvido para sua época, além de ajudar a definir as bases do que seria a matemática ocidental, sendo utilizado durante os séculos da idade média como único livro texto padrão.

## Justificativa para as regras de compasso e régua
Talvez para os quem não tenha tido contato ainda com a geometria feita pelos gregos, é importatne saber que os mesmos não utilizavam réguas ou compassos com marcação de tamanho, se guiando apenas pelos pontos de intersecção entre as formas. Sendo este um projeto que tem como meta estudar e aplicar os teoremas contidos nos Elementos, achamos importante manter estes tipo de contrução nos desenhos (embora seja necessária a determinção de alguns pontos com números devido a natureza do elemento canvas, que usa coordenadas cartesianas).

## Usando
No momento o livro 1 e a biblioteca de desenho ainda está em desenvolvimento, então sinta-se a vontade para sugerir todo tipo de coisa (incluindo diagramação das páginas, ainda sob estudo). Para utilizar o que já está pronto, basta clonar o repositório com o seguinte comando:
~~~
git clone git@github.com:karlsmarx/euclidsJS.git
~~~

A biblioteca possui as classes linha (line) e circulo(circle). Os objetos passados para o método régua (ruler) devem ser instâncias da classe line, e os objeto passados para o método compasso (compass) devem ser instância da classe circle. Além disso existe o método plotPoint, que desenha um ponto, além dos controels para os botões de zoom.

# Autor
Karl Alexander

# Próximos passos (TO DO)
- Finalizar os textos do livro 1
- Determinar a diagramação das páginas
- Terminar de implementar as regras da biblioteca JS
