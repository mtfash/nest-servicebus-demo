import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { PostsModule } from './posts/posts.module';

config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
