import { Injectable, Logger } from '@nestjs/common';
import { ConfigurationService } from '@config/configuration.service';

@Injectable()
export class N8nService {
  private readonly logger = new Logger(N8nService.name);
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigurationService) {
    // Obtenemos la URL base una sola vez al iniciar, ej: "https://n8n.mi-dominio.com"
    // Validamos que no termine en slash para concatenar limpio, o lo manejamos en la construcción
    const url = this.configService.getString('N8N_URL');
    this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  }

  /**
   * Envía un payload a un webhook de N8N.
   *
   * @param webhookPathOrEnvVar El nombre de la variable de entorno que contiene el path del webhook (ej: 'CONTACT_WEBHOOK_URL')
   *                          o el path directamente si se prefiere.
   *                          Por seguridad y consistencia, asumimos que recibimos el NOMBRE de la variable de entorno
   *                          para buscarla en ConfigService, pero para flexibilidad permitiré pasar el path si no se encuentra como variable.
   * @param payload El cuerpo del mensaje (JSON).
   */
  async sendWebhook(webhookPathOrEnvVar: string, payload: any): Promise<void> {
    // Intentamos obtener el path desde las variables de entorno primero
    let webhookPath: string;
    try {
      webhookPath = this.configService.getString(webhookPathOrEnvVar);
    } catch {
      // Si falla (no existe la variable), asumimos que el valor pasado ES el path
      webhookPath = webhookPathOrEnvVar;
    }

    // Aseguramos que el path empiece con / si la base no lo tiene (ya la limpiamos en el constructor)
    if (!webhookPath.startsWith('/')) {
      webhookPath = `/${webhookPath}`;
    }

    const fullUrl = `${this.baseUrl}${webhookPath}`;

    this.logger.log(`Sending webhook to N8N: ${webhookPathOrEnvVar} (${fullUrl})`);

    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => 'No response body');
        this.logger.error(
          `N8N Webhook failed. Status: ${response.status}. Response: ${text}`,
        );
        throw new Error(
          `N8N Webhook call failed with status ${response.status}`,
        );
      }

      this.logger.log('N8N Webhook sent successfully');
    } catch (error) {
      this.logger.error(`Error sending N8N webhook: ${error.message}`, error.stack);
      throw error; // Re-lanzamos para que el caller decida si es crítico o no
    }
  }
}
