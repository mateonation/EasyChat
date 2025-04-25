import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { ROLES_KEY } from "./roles.decorator";
import { ForbiddenException } from "src/errors/forbiddenException";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if(!requiredRoles || requiredRoles.length===0) return true;

        const req = context.switchToHttp().getRequest();
        let userId = 0;
        if(!req.session.user.id){
            return false;
        }else{
            userId = req.session.user.id;
        }

        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['roles'],
        })
        if (!user) return false;

        const userRoles = user.roles.map((role) => role.name );
        const hasRole = requiredRoles.some((role) => userRoles.includes(role));

        if(!hasRole){
            throw new ForbiddenException("You don't have enough permissions")
        }

        return true;
    }
}