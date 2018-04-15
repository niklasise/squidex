/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { Observable } from 'rxjs';
import { IMock, Mock, Times } from 'typemoq';

import { UsersState } from './../state/users.state';
import { UnsetUserGuard } from './unset-user.guard';

describe('UnsetUserGuard', () => {
    let usersState: IMock<UsersState>;
    let userGuard: UnsetUserGuard;

    beforeEach(() => {
        usersState = Mock.ofType<UsersState>();
        userGuard = new UnsetUserGuard(usersState.object);
    });

    it('should unset user', () => {
        usersState.setup(x => x.selectUser(null))
            .returns(() => Observable.of(null));

        let result: boolean;

        userGuard.canActivate().subscribe(x => {
            result = x;
        }).unsubscribe();

        expect(result!).toBeTruthy();

        usersState.verify(x => x.selectUser(null), Times.once());
    });
});