import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './entities/role.entity';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) 
    private readonly roleModel: Model<RoleDocument>,
  ){}
  async getAllRole(){
    const data = await this.roleModel.find()
    return {
      data
    }
  }

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
