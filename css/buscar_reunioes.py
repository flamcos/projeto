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

    # Busca as credenciais no Secrets Manager
    db_credentials = get_db_credentials(secret_arn, region)
    db_host = db_credentials['host']
    db_name = db_credentials['dbname']
    db_user = db_credentials['username']
    db_pass = db_credentials['password']
    db_port = int(db_credentials.get('port', 3306))

    # Conecta e faz o SELECT no banco
    conn = pymysql.connect(
        host=db_host,
        user=db_user,
        password=db_pass,
        database=db_name,
        port=db_port,
        connect_timeout=5
    )
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cur:
            cur.execute("SELECT id, nome, data_hora, participantes FROM reunioes")
            reunioes = cur.fetchall()
    finally:
        conn.close()

    return {
        'statusCode': 200,
        'body': json.dumps(reunioes)
    }