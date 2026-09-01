# Mock ERP / Primavera API

Este repositório contém a implementação do **Mock ERP / Primavera API**, um serviço de simulação desenhado para receber requisições de integração do DocuWare (ou outros sistemas) e se comportar como o Primavera ERP.

## Objetivo
O sistema simula a criação de Fornecedores, gerando códigos sequenciais (C001, C002...) e mantendo os dados salvos num banco de dados JSON leve e persistente. Possui uma interface gráfica limpa para acompanhar os dados recebidos em tempo real.

## Arquitetura
- **Linguagem:** Node.js + Express
- **Persistência:** Ficheiro JSON em volume Docker (`data/db.json`).
- **Segurança:** Configuração de Headers via Helmet, limitação de payload (1MB) e tratamento seguro de exceções (sem vazamento de *stack traces*).
- **Apresentação:** Interface Vanilla JS + HTML responsiva no endpoint raiz `/`.
- **Documentação:** Swagger UI interativo integrado via `swagger-ui-express` no endpoint `/docs`.

## Como executar localmente
Se quiser testar na sua máquina antes de enviar para o servidor:
```bash
docker compose up -d --build
```
A API ficará disponível na porta **8081**:
- **Interface Web:** `http://localhost:8081`
- **Swagger UI:** `http://localhost:8081/docs`

## Ambiente Contabo e Deploy Automático
O ambiente de produção (simulador) está hospedado numa VPS da **Contabo**.
O deploy é automatizado através de **GitHub Actions**. Qualquer `push` para a *branch* `main` irá acionar o pipeline.

### Porta Utilizada
O serviço expõe a porta **`8081`** externamente.

### Variáveis Secretas (GitHub Secrets)
Para o deploy funcionar, configure os seguintes secrets no seu repositório GitHub (`Settings > Secrets and variables > Actions`):
- `CONTABO_HOST`: IP do seu servidor Contabo (ex: `123.45.67.89`)
- `CONTABO_USER`: Seu usuário SSH (geralmente `root` ou `ubuntu`)
- `CONTABO_SSH_KEY`: Sua chave privada SSH (RSA/Ed25519)
- `CONTABO_PORT`: A porta do SSH (geralmente `22`)
- `DEPLOY_PATH`: O caminho completo no servidor onde este repositório foi clonado (ex: `/root/Moker-API`)

### Verificação do Deploy Automático
O próprio pipeline executa um *health check* internamente ao final do processo via CURL local:
```bash
curl http://127.0.0.1:8081/health
```
Se a resposta não for HTTP 200, o deploy falha e os logs do container são exibidos no GitHub Actions para fácil diagnóstico.

## Endpoints Principais
- `GET /health` : Retorna status do serviço.
- `POST /api/v1/suppliers` : Cria um novo fornecedor.
- `GET /api/v1/suppliers` : Lista todos os fornecedores.
- `GET /api/v1/suppliers/:code` : Busca fornecedor específico pelo ERP Code.
- `DELETE /api/v1/suppliers/:code` : Apaga um fornecedor.
- `POST /api/v1/suppliers/clear` : Apaga todos os registros de fornecedores, mas **mantém** o contador sequencial.
- `POST /api/v1/suppliers/reset` : Apaga todos os fornecedores e **reseta** o contador sequencial (próximo volta a ser C001).

## Gestão de Dados Persistentes
O volume persistente garante que os dados não sejam apagados entre os deploys:
```yaml
volumes:
  mock_erp_data:
```
O arquivo JSON é gravado dentro do volume no container em `/app/data/db.json`.
Você pode reiniciar exclusivamente este container sem impactar o resto da infraestrutura (WP Process Cloud App):
```bash
docker restart mock-erp-api
```
