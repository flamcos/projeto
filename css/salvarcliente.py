import pymysql
import boto3
import json
import os

def get_db_credentials(secret_arn, region):
    client = boto3.client('secretsmanager', region_name=region)
    secret = client.get_secret_value(SecretId=secret_arn)
    return json.loads(secret['SecretString'])

def lambda_handler(event, context):
    # Busca as variáveis de ambiente
    secret_arn = os.environ['DB_SECRET_ARN']
    region = os.environ['AWS_REGION']
    sns_topic_arn = os.environ['SNS_TOPIC_ARN']

    # Busca as credenciais no Secrets Manager
    db_credentials = get_db_credentials(secret_arn, region)
    db_host = db_credentials['host']
    db_name = db_credentials['dbname']
    db_user = db_credentials['username']
    db_pass = db_credentials['password']
    db_port = int(db_credentials.get('port', 3306))

    # Extrai o reunião do body do evento do API Gateway
    body = json.loads(event['body'])
    reuniao = {
        'nome': body['nome'],
        'data_hora': body['data_hora'],
        'lista_participantes': body['lista_participante']
    }

    # Conecta e insere no banco
    conn = pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_pass,
        database=db_name,
        port=db_port,
        connect_timeout=5
    )
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO reunioes (nome, data_hora, participantes) VALUES (%s, %s, %s)",
                (reuniao['nome'], reuniao['data_hora'], reuniao['lista_participantes'])
            )
            conn.commit()
    finally:
        conn.close()

    # # Publica mensagem no SNS
    # sns = boto3.client('sns', region_name=region)
    # mensagem = f"Nova reunião cadastrado: {reuniao['nome']} ({reuniao['email']})"
    # sns.publish(
    #     TopicArn=sns_topic_arn,
    #     Message=mensagem,
    #     Subject='Novo Cadastro de Cliente'
    # )

    return {
        'statusCode': 201,
        'body': json.dumps({'status': 'success'})
    }