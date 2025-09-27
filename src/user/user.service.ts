import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Driver, Node } from 'neo4j-driver';

export interface UserProperties {
  name: string;
  [key: string]: any;
}

@Injectable()
export class UserService {
  constructor(@Inject('NEO4J_DRIVER') private readonly driver: Driver) {}

  async createUser(name: string) {
    if (!name || name.trim() === '') {
      throw new BadRequestException('User name cannot be empty');
    }

    const session = this.driver.session();
    try {
      await session.run('CREATE (u:User {name: $name}) RETURN u', {
        name: name.trim(),
      });
      return { message: `User ${name.trim()} created` };
    } finally {
      await session.close();
    }
  }

  async followUser(follower: string, followee: string) {
    if (!follower || follower.trim() === '') {
      throw new BadRequestException('Follower name cannot be empty');
    }
    if (!followee || followee.trim() === '') {
      throw new BadRequestException('Followee name cannot be empty');
    }

    const session = this.driver.session();
    try {
      await session.run(
        `MATCH (a:User {name: $follower}), (b:User {name: $followee})
         CREATE (a)-[:FOLLOWS]->(b)`,
        { follower: follower.trim(), followee: followee.trim() },
      );
      return { message: `${follower.trim()} now follows ${followee.trim()}` };
    } finally {
      await session.close();
    }
  }

  async getFollowers(name: string): Promise<UserProperties[]> {
    if (!name || name.trim() === '') {
      throw new BadRequestException('User name cannot be empty');
    }

    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {name: $name})<-[:FOLLOWS]-(f:User)
         RETURN f`,
        { name: name.trim() },
      );
      return result.records.map((r) => {
        const node = r.get('f') as Node;
        return node.properties as UserProperties;
      });
    } finally {
      await session.close();
    }
  }

  async getFollowing(name: string): Promise<UserProperties[]> {
    if (!name || name.trim() === '') {
      throw new BadRequestException('User name cannot be empty');
    }

    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {name: $name})-[:FOLLOWS]->(f:User)
         RETURN f`,
        { name: name.trim() },
      );
      return result.records.map((r) => {
        const node = r.get('f') as Node;
        return node.properties as UserProperties;
      });
    } finally {
      await session.close();
    }
  }
}
