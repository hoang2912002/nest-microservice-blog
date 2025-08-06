import { Injectable } from '@nestjs/common';
import { CreateSupbaseInput } from './dto/create-supbase.input';
import { UpdateSupbaseInput } from './dto/update-supbase.input';
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'fs/promises';
@Injectable()
export class SupbaseService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // dùng service role nếu từ backend
  );
  create(createSupbaseInput: CreateSupbaseInput) {
    return 'This action adds a new supbase';
  }

  findAll() {
    return `This action returns all supbase`;
  }

  findOne(id: number) {
    return `This action returns a #${id} supbase`;
  }

  update(id: number, updateSupbaseInput: UpdateSupbaseInput) {
    return `This action updates a #${id} supbase`;
  }

  remove(id: number) {
    return `This action removes a #${id} supbase`;
  }

  async uploadFile(localPath: string, bucket: string, fileName: string): Promise<string> {
    const fileBuffer = await readFile(localPath);

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg', // hoặc dynamic nếu bạn đọc mime-type
        upsert: true, // ghi đè nếu file đã tồn tại
      });

    if (error) throw error;

    const { data: publicUrlData } = this.supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrlData?.publicUrl;
  }
}
