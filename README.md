## Autores
- IGOR ABREU FORTUNATO
- MARCOS VINICIUS PAIVA CARVALHAR
- PEDRO HENRIQUE SANTANA QUINTILIANO

# FinControl

FinControl é uma aplicação web moderna para controle financeiro pessoal, desenvolvida como trabalho da disciplina de Programação Web - Desenvolvimento com Tecnologia Livre.

## Sobre o Projeto

O objetivo do FinControl é fornecer uma interface intuitiva e eficiente para que usuários possam gerenciar suas receitas e despesas, categorizar transações e visualizar relatórios detalhados sobre sua saúde financeira.

## Funcionalidades

-   **Dashboard**: Visão geral com gráficos de receitas vs despesas, totais por categoria e saldo acumulado diário.
-   **Transações**: Cadastro, edição e exclusão de receitas e despesas.
-   **Categorias**: Gerenciamento de categorias personalizadas para organização das transações.
-   **Relatórios**: Geração de relatórios em PDF filtrados por período, tipo de transação e categoria.
-   **Autenticação**: Sistema seguro de login e registro de usuários.

## Tecnologias Utilizadas

### Frontend
-   **Next.js 16**: Framework React para produção.
-   **TailwindCSS**: Framework CSS utilitário para estilização rápida e responsiva.
-   **Chart.js / React-Chartjs-2**: Biblioteca para criação de gráficos interativos.
-   **React Icons**: Biblioteca de ícones.
-   **React Toastify**: Notificações para feedback do usuário.

### Backend
-   **Node.js**: Ambiente de execução JavaScript.
-   **Express**: Framework web para Node.js.
-   **Sequelize**: ORM para interação com banco de dados SQL.
-   **MySQL**: Banco de dados relacional.
-   **JWT (JSON Web Token)**: Para autenticação segura.

## Como Executar

### Pré-requisitos
-   Node.js instalado.
-   MySQL instalado e rodando.

### Configuração do Backend
1.  Navegue até a pasta `backend`.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure o banco de dados no arquivo `database/database.js` (ou variável de ambiente).
4.  Execute o script SQL em `Banco de dados/bd.sql` para criar as tabelas.
5.  Inicie o servidor:
    ```bash
    node index.js
    ```

### Configuração do Frontend
1.  Navegue até a pasta `frontend`.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Acesse `http://localhost:3000` no seu navegador.
