import { Module, Global } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';

@Global()
@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      useFactory: (): Driver => {
        return neo4j.driver(
          'bolt://localhost:7687',
          neo4j.auth.basic('neo4j', 'password'),
        );
      },
    },
  ],
  exports: ['NEO4J_DRIVER'],
})
export class Neo4jModule {}
