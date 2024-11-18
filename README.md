# AI Content Factory Back

**AI Content Factory Back** é a API back-end projetada para fornecer suporte completo ao front-end **AI Content Factory Front**, permitindo a criação e gerenciamento de conteúdos gerados por inteligência artificial. Desenvolvido com **TypeScript**, **Express** e **MongoDB**, o sistema segue as melhores práticas de **Clean Code**, **Clean Architecture**, **DDD**, **EDD** e **injeção de dependências**. Esta API permite a integração com diversas ferramentas de IA, como **ChatGPT**, **DALL·E**, **Midjourney**, **Automatic1111** e **Luma Labs**, para criação e gerenciamento de conteúdos gerados por IA.

## 🔗 Projetos Relacionados

- **[AI Content Factory Front](https://github.com/vbss-io/ai-content-factory-front)**: O front-end que permite visualizar conteúdos gerados por IA. Demonstração disponível em [ai.vbss.io](https://ai.vbss.io).

## 🛠 Tecnologias utilizadas

- **Linguagem**: TypeScript  
- **Framework**: Express  
- **Banco de dados**: MongoDB  
- **Integrações de IA**: ChatGPT, DALL·E 3, Midjourney, Automatic1111 e Luma Labs
- **Autenticação**: JWT para autenticação e autorização de usuários  
- **Eventos**: Processamento assíncrono utilizando eventos e cron jobs  
- **Arquitetura**: Clean Code, Clean Architecture, DDD, EDD  
- **Eventos e Cron Jobs**: Processamento assíncrono para criação de conteúdo automatizado
  
## 🔑 Funcionalidades

### **Gestão de Usuários**

- **Criação e Login**: Usuários podem se registrar e fazer login utilizando JWT para autenticação.
- **Foto de Perfil**: Usuários podem atualizar suas fotos de perfil através da API.
- **Autenticação**: Sistema de autenticação baseado em JWT, garantindo que apenas usuários autenticados possam realizar ações como criar conteúdo.

### **Criação e Gestão de Conteúdo**

- **Criação de Imagens e Vídeos**: Usuários podem solicitar a criação de imagens ou vídeos gerados por IA, utilizando integrações com ferramentas como **DALL·E**, **Midjourney**, **Automatic1111** e **Luma Labs**.
- **Processamento Assíncrono**: O conteúdo gerado passa por eventos e filas de processamento, garantindo uma criação eficiente.
- **Batch Processing**: Criação de batches para agrupar múltiplas imagens ou vídeos e otimizar o processamento.
- **Interação do Usuário**: Usuários podem visualizar, curtir e compartilhar o conteúdo gerado por outros usuários.

### **Automação e Tarefas Agendadas**

- **Cron Jobs**: Sistema automatizado para criar conteúdo em horários específicos ou em massa, utilizando **cron jobs** para gerenciar as tarefas.
- **Eventos**: Processamento de solicitações de criação de conteúdo baseado em eventos, garantindo escalabilidade e desempenho.

## 🌟 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests neste repositório.  

## 📅 Status

Este projeto está em desenvolvimento e continua recebendo atualizações. Fique atento a novas funcionalidades e melhorias.
