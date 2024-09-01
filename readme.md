# Twitter Status Notifier

## Descrição

O **Twitter is Up** é uma aplicação Node.js que monitora o status do Twitter e notifica sobre sua disponibilidade através do Discord e do BlueSky. Atualmente o Twitter (X) Está inativo no Brasil por conta de um ato do juíz Alexandre de Moraes.

## Funcionalidades

- **Verificação do Status do Twitter**: Utiliza a ferramenta `dig` para verificar se o Twitter está ativo com base nos registros DNS.
- **Notificações**: Envia notificações para um canal do Discord e realiza postagens no BlueSky.
- **Mensagens Offline**: Envia mensagens específicas se o Twitter estiver fora do ar em horários programados.

## Dependências

- `axios`: Para fazer requisições HTTP.
- `node-schedule`: Para agendar tarefas.
- `@atproto/api`: Para interagir com o BlueSky.
- `dotenv`: Para gerenciar variáveis de ambiente.
- `child_process`: Para executar comandos do sistema, como `dig`.

## Instalação

1. **Clone o repositório**:

    ```bash
    git clone https://github.com/JvGm45/twitterisup.git
    ```

2. **Instale as dependências**:

    ```bash
    npm install
    ```

3. **Crie um arquivo `.env`** na raiz do projeto com as seguintes variáveis de ambiente:

    ```env
    DISCORD_WEBHOOK_URL=<URL_DO_WEBHOOK_DO_DISCORD>
    BS_USER=<SEU_USUARIO_DO_BLUE_SKY>
    BS_PASSWORD=<SUA_SENHA_DO_BLUE_SKY>
    DNS_SERVER_IP=<IP_DO_SERVIDOR_DNS>
    ```

## Uso

1. **Verificar Status do Twitter**: O script verifica o status do Twitter a cada 2 minutos e notifica quando o Twitter volta a funcionar.

2. **Notificar Status Offline**: Em horários específicos (08:00, 12:00, 16:00, 20:00), o script notifica sobre o status offline do Twitter.

3. **Notificação de Twitter Voltar**: Quando o Twitter volta, uma notificação é enviada para o Discord e um post é feito no BlueSky.

4. **Mensagens Offline**: Se o Twitter estiver fora do ar, mensagens de status offline aleatórias são enviadas para o Discord e o BlueSky.

## Agendamento

O script usa `node-schedule` para agendar a execução de notificações offline nos seguintes horários:

- 08:00
- 12:00
- 16:00
- 20:00

## Executar o Script

Para iniciar o script, execute o comando:

```bash
node index.js
```