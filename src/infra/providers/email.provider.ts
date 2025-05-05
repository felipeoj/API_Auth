import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const EmailClientProvider = {
  provide: 'EMAIL_CLIENT',
  useFactory: () => {
    return ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 4001 },
    });
  },
};
