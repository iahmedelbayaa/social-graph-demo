import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Neo4jModule } from './neo4j/neo4j.module';

@Module({
  imports: [Neo4jModule],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
