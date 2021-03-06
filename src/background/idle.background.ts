import MainBackground from './main.background';

import { ConstantsService } from 'jslib/services';

import {
    LockService,
    StorageService,
} from 'jslib/abstractions';

export default class IdleBackground {
    private idle: any;

    constructor(private main: MainBackground, private lockService: LockService,
        private storageService: StorageService) {
        this.idle = chrome.idle;
    }

    async init() {
        if (!this.idle) {
            return;
        }

        if (this.idle.onStateChanged) {
            this.idle.onStateChanged.addListener(async (newState: string) => {
                if (newState === 'locked') {
                    const lockOption = await this.storageService.get<number>(ConstantsService.lockOptionKey);
                    if (lockOption === -2) {
                        this.lockService.lock();
                    }
                }
            });
        }
    }
}
