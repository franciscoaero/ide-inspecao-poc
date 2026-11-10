# Linguagem da POC

A linguagem descreve uma receita, parâmetros de inspeção e regras ordenadas.

```text
RECEITA modelo_demonstrativo_a

GEOMETRIA {
  ovalizacao_maxima = 4.7
}

ALETAS {
  quantidade_esperada = 18
  presenca_minima = 81
}

REGRA {
  SE ovalizacao > ovalizacao_maxima ENTAO REJEITAR
  SE aletas_detectadas < quantidade_esperada ENTAO REVISAR
  SE presenca_aletas < presenca_minima ENTAO REVISAR
  SENAO APROVAR
}
```

## Elementos

- `RECEITA`: identifica a configuração.
- `GEOMETRIA` e `ALETAS`: agrupam parâmetros numéricos.
- `SE ... ENTAO`: cria uma regra condicional.
- `SENAO`: define o resultado quando nenhuma regra anterior é satisfeita.
- Resultados permitidos: `APROVAR`, `REVISAR` e `REJEITAR`.
- Operadores permitidos: `>`, `<`, `>=`, `<=`, `==` e `!=`.
- Comentários começam com `#` e terminam no fim da linha.

As regras são avaliadas de cima para baixo. A primeira condição verdadeira determina o resultado.
