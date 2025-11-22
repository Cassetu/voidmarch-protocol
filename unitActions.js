class UnitActionSystem {
    constructor(game) {
        this.game = game;
        this.selectedUnit = null;
        this.actionMode = null;
        this.tauntedSentinels = new Map();
    }

    showActionMenu(unit) {
        this.selectedUnit = unit;
        this.hideActionMenu();

        const backdrop = document.createElement('div');
        backdrop.id = 'unit-action-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            pointer-events: auto;
        `;
        backdrop.onclick = (e) => {
            e.stopPropagation();
            this.hideActionMenu();
            this.actionMode = null;
            this.selectedUnit = null;
        };
        document.body.appendChild(backdrop);

        const menu = document.createElement('div');
        menu.id = 'unit-action-menu';
        menu.style.cssText = `
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a2a4a 0%, #2a3a5a 100%);
            border: 3px solid #4a6a8a;
            border-radius: 8px;
            padding: 20px;
            z-index: 9999;
            pointer-events: auto;
            min-width: 250px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
        `;
        menu.onclick = (e) => {
            e.stopPropagation();
        };

        const title = document.createElement('h3');
        title.textContent = `${unit.type.toUpperCase()} - Actions`;
        title.style.cssText = `
            color: #8fa3c8;
            margin-bottom: 15px;
            text-align: center;
            font-size: 16px;
        `;
        menu.appendChild(title);

        const buttons = [];

        if (!unit.moved) {
            const moveBtn = this.createActionButton('Move', '#4a7a4a');
            moveBtn.onclick = () => {
                this.actionMode = 'move';
                this.hideActionMenu();
                this.game.log(`Select a tile to move to (range: ${unit.moveRange}) - Press ESC to cancel`);
            };
            buttons.push(moveBtn);
        }

        if (!unit.attacked) {
            const attackBtn = this.createActionButton('Attack', '#7a4a4a');
            attackBtn.onclick = () => {
                this.actionMode = 'attack';
                this.hideActionMenu();
                this.game.log(`Select a target to attack (range: ${unit.range}) - Press ESC to cancel`);
            };
            buttons.push(attackBtn);
        }

        if (unit.type === 'hacker' && !unit.attacked) {
            const hackBtn = this.createActionButton('Hack Node', '#4a4a7a');
            hackBtn.onclick = () => {
                const node = this.game.conquestSystem.defenseNodes.find(n => !n.hacked);
                if (node) {
                    const distance = Math.abs(unit.x - node.x) + Math.abs(unit.y - node.y);
                    if (distance <= 2) {
                        if (this.game.conquestSystem.startHacking(node.id)) {
                            this.hideActionMenu();
                            this.game.showHackingMiniGame();
                        }
                    } else {
                        this.game.log('Hacker must be within 2 tiles of a defense node!');
                    }
                } else {
                    this.game.log('No unhacked nodes available!');
                }
            };
            buttons.push(hackBtn);
        }

        const specialBtn = this.createSpecialAbilityButton(unit);
        if (specialBtn) {
            buttons.push(specialBtn);
        }

        const cancelBtn = this.createActionButton('Cancel', '#3a3a4a');
        cancelBtn.onclick = () => {
            this.hideActionMenu();
            this.actionMode = null;
            this.selectedUnit = null;
        };
        buttons.push(cancelBtn);

        buttons.forEach(btn => menu.appendChild(btn));
        document.body.appendChild(menu);
    }

    createActionButton(text, color) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.cssText = `
            width: 100%;
            padding: 10px;
            margin: 5px 0;
            background: ${color};
            border: 2px solid ${this.lightenColor(color)};
            color: #ffffff;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
        `;
        btn.onmouseenter = () => {
            btn.style.background = this.lightenColor(color);
            btn.style.transform = 'translateY(-2px)';
        };
        btn.onmouseleave = () => {
            btn.style.background = color;
            btn.style.transform = 'translateY(0)';
        };
        return btn;
    }

    lightenColor(color) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + 30);
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + 30);
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + 30);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    createSpecialAbilityButton(unit) {
        if (unit.specialUsed) return null;

        let text, color, action;

        switch(unit.type) {
            case 'tank':
                text = 'Taunt (2 turns)';
                color = '#6a4a2a';
                action = () => this.useTankTaunt(unit);
                break;
            case 'assault':
                text = 'Charge Strike';
                color = '#7a3a3a';
                action = () => this.useAssaultCharge(unit);
                break;
            case 'ranger':
                text = 'Overwatch';
                color = '#3a5a3a';
                action = () => this.useRangerOverwatch(unit);
                break;
            case 'hacker':
                text = 'EMP Blast';
                color = '#5a3a6a';
                action = () => this.useHackerEMP(unit);
                break;
            default:
                return null;
        }

        const btn = this.createActionButton(text, color);
        btn.onclick = () => {
            action();
            this.hideActionMenu();
        };
        return btn;
    }

    useTankTaunt(unit) {
        unit.specialUsed = true;
        unit.tauntTurns = 2;

        this.game.conquestSystem.sentinels.forEach(sentinel => {
            this.tauntedSentinels.set(sentinel.id, { targetId: unit.id, turnsLeft: 2 });
        });

        this.game.log(`${unit.type.toUpperCase()} uses TAUNT! All sentinels will target it for 2 turns!`);
    }

    useAssaultCharge(unit) {
        unit.specialUsed = true;
        unit.chargeDamage = unit.damage * 2;
        unit.attacked = false;

        this.game.log(`${unit.type.toUpperCase()} uses CHARGE STRIKE! Next attack deals double damage!`);
        this.actionMode = 'attack';
        this.game.log(`Select a target to attack with CHARGE (range: ${unit.range})`);
    }

    useRangerOverwatch(unit) {
        unit.specialUsed = true;
        unit.overwatchActive = true;

        this.game.log(`${unit.type.toUpperCase()} enters OVERWATCH! Will auto-attack any sentinel that moves within range.`);
    }

    useHackerEMP(unit) {
        unit.specialUsed = true;

        const affectedSentinels = this.game.conquestSystem.sentinels.filter(sentinel => {
            const distance = Math.abs(unit.x - sentinel.x) + Math.abs(unit.y - sentinel.y);
            return distance <= 3;
        });

        affectedSentinels.forEach(sentinel => {
            sentinel.empStunned = true;
            sentinel.empStunTurns = 1;
        });

        this.game.log(`${unit.type.toUpperCase()} uses EMP BLAST! ${affectedSentinels.length} sentinels stunned for 1 turn!`);
    }

    hideActionMenu() {
        const menu = document.getElementById('unit-action-menu');
        if (menu) {
            document.body.removeChild(menu);
        }
        const backdrop = document.getElementById('unit-action-backdrop');
        if (backdrop) {
            document.body.removeChild(backdrop);
        }
    }

    processOverwatch(movedSentinel) {
        const overwatchUnits = this.game.conquestSystem.armies.filter(a => a.overwatchActive);

        overwatchUnits.forEach(unit => {
            const distance = Math.abs(unit.x - movedSentinel.x) + Math.abs(unit.y - movedSentinel.y);
            if (distance <= unit.range) {
                const damage = unit.damage;
                movedSentinel.health -= damage;
                this.game.log(`OVERWATCH! ${unit.type} shot ${movedSentinel.type} for ${damage} damage!`);

                if (movedSentinel.health <= 0) {
                    this.game.conquestSystem.sentinels = this.game.conquestSystem.sentinels.filter(s => s.id !== movedSentinel.id);
                    this.game.log(`Sentinel destroyed by overwatch!`);
                }
            }
        });
    }

    onTurnEnd() {
        this.tauntedSentinels.forEach((taunt, sentinelId) => {
            taunt.turnsLeft--;
            if (taunt.turnsLeft <= 0) {
                this.tauntedSentinels.delete(sentinelId);
            }
        });

        this.game.conquestSystem.armies.forEach(unit => {
            if (unit.tauntTurns) {
                unit.tauntTurns--;
                if (unit.tauntTurns <= 0) {
                    delete unit.tauntTurns;
                }
            }
        });

        this.game.conquestSystem.sentinels.forEach(sentinel => {
            if (sentinel.empStunTurns) {
                sentinel.empStunTurns--;
                if (sentinel.empStunTurns <= 0) {
                    delete sentinel.empStunned;
                    delete sentinel.empStunTurns;
                }
            }
        });
    }
}