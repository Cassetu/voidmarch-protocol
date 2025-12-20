const BuildingDrawings = {
    hut: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#5a4a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 12);
        ctx.lineTo(screenX + 8, screenY - 8);
        ctx.lineTo(screenX + 8, screenY + 2);
        ctx.lineTo(screenX, screenY + 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 12);
        ctx.lineTo(screenX - 8, screenY - 8);
        ctx.lineTo(screenX - 8, screenY + 2);
        ctx.lineTo(screenX, screenY + 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 12);
        ctx.lineTo(screenX - 8, screenY - 8);
        ctx.lineTo(screenX, screenY - 4);
        ctx.lineTo(screenX + 8, screenY - 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },

    settlement: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#5a4a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX + 12, screenY - 14);
        ctx.lineTo(screenX + 12, screenY + 2);
        ctx.lineTo(screenX, screenY + 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX - 12, screenY - 14);
        ctx.lineTo(screenX - 12, screenY + 2);
        ctx.lineTo(screenX, screenY + 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8b7355';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX - 12, screenY - 14);
        ctx.lineTo(screenX, screenY - 8);
        ctx.lineTo(screenX + 12, screenY - 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 8);
        ctx.lineTo(screenX - 10, screenY - 3);
        ctx.lineTo(screenX - 10, screenY - 18);
        ctx.lineTo(screenX, screenY - 24);
        ctx.lineTo(screenX + 10, screenY - 18);
        ctx.lineTo(screenX + 10, screenY - 3);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a2a1a';
        ctx.beginPath();
        ctx.moveTo(screenX - 4, screenY);
        ctx.lineTo(screenX - 7, screenY - 1.5);
        ctx.lineTo(screenX - 7, screenY + 4);
        ctx.lineTo(screenX - 4, screenY + 5.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a6a8a';
        ctx.beginPath();
        ctx.moveTo(screenX + 4, screenY - 8);
        ctx.lineTo(screenX + 7, screenY - 9.5);
        ctx.lineTo(screenX + 7, screenY - 5.5);
        ctx.lineTo(screenX + 4, screenY - 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    },

    township: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 24);
        ctx.lineTo(screenX + 14, screenY - 17);
        ctx.lineTo(screenX + 14, screenY + 3);
        ctx.lineTo(screenX, screenY + 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 24);
        ctx.lineTo(screenX - 14, screenY - 17);
        ctx.lineTo(screenX - 14, screenY + 3);
        ctx.lineTo(screenX, screenY + 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a7a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 24);
        ctx.lineTo(screenX - 14, screenY - 17);
        ctx.lineTo(screenX, screenY - 10);
        ctx.lineTo(screenX + 14, screenY - 17);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(screenX - 6, screenY - 6, 5, 8);
        ctx.fillRect(screenX + 2, screenY - 4, 4, 6);
        ctx.fillStyle = '#ffa500';
        ctx.fillRect(screenX - 4, screenY, 2, 2);
        ctx.restore();
    },

    farm: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#6a4a2a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX + 14, screenY - 10);
        ctx.lineTo(screenX + 14, screenY + 4);
        ctx.lineTo(screenX, screenY + 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a6a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 14, screenY - 10);
        ctx.lineTo(screenX - 14, screenY + 4);
        ctx.lineTo(screenX, screenY + 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#9a7a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 14, screenY - 10);
        ctx.lineTo(screenX, screenY - 4);
        ctx.lineTo(screenX + 14, screenY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a3a1a';
        ctx.beginPath();
        ctx.moveTo(screenX - 6, screenY + 2);
        ctx.lineTo(screenX - 9, screenY + 0.5);
        ctx.lineTo(screenX - 9, screenY + 4.5);
        ctx.lineTo(screenX - 6, screenY + 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a7c59';
        ctx.beginPath();
        ctx.moveTo(screenX - 8, screenY + 8);
        ctx.lineTo(screenX - 6, screenY + 7);
        ctx.lineTo(screenX - 4, screenY + 8);
        ctx.lineTo(screenX - 6, screenY + 9);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(screenX + 4, screenY + 8);
        ctx.lineTo(screenX + 6, screenY + 7);
        ctx.lineTo(screenX + 8, screenY + 8);
        ctx.lineTo(screenX + 6, screenY + 9);
        ctx.closePath();
        ctx.fill();
    },

    warehouse: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#555545';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX + 18, screenY - 10);
        ctx.lineTo(screenX + 18, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#626253';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX - 18, screenY - 10);
        ctx.lineTo(screenX - 18, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#777767';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX - 18, screenY - 10);
        ctx.lineTo(screenX, screenY - 2);
        ctx.lineTo(screenX + 18, screenY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2f2f22';
        ctx.beginPath();
        ctx.moveTo(screenX + 6, screenY + 4);
        ctx.lineTo(screenX + 12, screenY + 2);
        ctx.lineTo(screenX + 12, screenY + 12);
        ctx.lineTo(screenX + 6, screenY + 14);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(screenX - 6, screenY + 4);
        ctx.lineTo(screenX - 12, screenY + 2);
        ctx.lineTo(screenX - 12, screenY + 12);
        ctx.lineTo(screenX - 6, screenY + 14);
        ctx.closePath();
        ctx.fill();
    },

    barracks: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#5a3a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 22);
        ctx.lineTo(screenX + 14, screenY - 15);
        ctx.lineTo(screenX + 14, screenY + 2);
        ctx.lineTo(screenX, screenY + 9);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a4a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 22);
        ctx.lineTo(screenX - 14, screenY - 15);
        ctx.lineTo(screenX - 14, screenY + 2);
        ctx.lineTo(screenX, screenY + 9);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a5a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 22);
        ctx.lineTo(screenX - 14, screenY - 15);
        ctx.lineTo(screenX, screenY - 8);
        ctx.lineTo(screenX + 14, screenY - 15);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a2a2a';
        ctx.beginPath();
        ctx.moveTo(screenX - 10, screenY - 28);
        ctx.lineTo(screenX - 7, screenY - 29.5);
        ctx.lineTo(screenX - 7, screenY - 20);
        ctx.lineTo(screenX - 10, screenY - 18.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a1a1a';
        ctx.beginPath();
        ctx.moveTo(screenX - 4, screenY - 2);
        ctx.lineTo(screenX - 6, screenY - 3);
        ctx.lineTo(screenX - 6, screenY + 3);
        ctx.lineTo(screenX - 4, screenY + 4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a6a6a';
        ctx.beginPath();
        ctx.moveTo(screenX + 6, screenY - 8);
        ctx.lineTo(screenX + 9, screenY - 9.5);
        ctx.lineTo(screenX + 9, screenY - 5.5);
        ctx.lineTo(screenX + 6, screenY - 4);
        ctx.closePath();
        ctx.fill();
    },

    temple: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX + 16, screenY - 12);
        ctx.lineTo(screenX + 16, screenY + 4);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a7a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX - 16, screenY - 12);
        ctx.lineTo(screenX - 16, screenY + 4);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#9a8a7a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX - 16, screenY - 12);
        ctx.lineTo(screenX, screenY - 4);
        ctx.lineTo(screenX + 16, screenY - 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 4);
        ctx.lineTo(screenX - 14, screenY + 2);
        ctx.lineTo(screenX, screenY + 8);
        ctx.lineTo(screenX + 14, screenY + 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#e0d0b0';
        for(let i = -10; i <= 10; i += 5) {
            ctx.beginPath();
            ctx.moveTo(screenX + i, screenY);
            ctx.lineTo(screenX + i - 1, screenY - 0.5);
            ctx.lineTo(screenX + i - 1, screenY + 9);
            ctx.lineTo(screenX + i, screenY + 9.5);
            ctx.closePath();
            ctx.fill();
        }
    },

    forge: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#3a2a2a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX + 14, screenY - 11);
        ctx.lineTo(screenX + 14, screenY + 4);
        ctx.lineTo(screenX, screenY + 11);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a3a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX - 14, screenY - 11);
        ctx.lineTo(screenX - 14, screenY + 4);
        ctx.lineTo(screenX, screenY + 11);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a4a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX - 14, screenY - 11);
        ctx.lineTo(screenX, screenY - 4);
        ctx.lineTo(screenX + 14, screenY - 11);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a1a1a';
        ctx.beginPath();
        ctx.moveTo(screenX - 6, screenY - 24);
        ctx.lineTo(screenX - 3, screenY - 25.5);
        ctx.lineTo(screenX - 3, screenY - 18);
        ctx.lineTo(screenX - 6, screenY - 16.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff6a00';
        ctx.beginPath();
        ctx.moveTo(screenX - 4, screenY + 2);
        ctx.lineTo(screenX - 6, screenY + 1);
        ctx.lineTo(screenX - 6, screenY + 7);
        ctx.lineTo(screenX - 4, screenY + 8);
        ctx.lineTo(screenX + 4, screenY + 4);
        ctx.lineTo(screenX + 4, screenY + 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a7a6a';
        ctx.beginPath();
        ctx.moveTo(screenX + 8, screenY);
        ctx.lineTo(screenX + 10, screenY - 1);
        ctx.lineTo(screenX + 10, screenY + 1);
        ctx.lineTo(screenX + 8, screenY + 2);
        ctx.lineTo(screenX + 6, screenY + 1);
        ctx.lineTo(screenX + 6, screenY - 1);
        ctx.closePath();
        ctx.fill();
    },

    market: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX + 16, screenY - 9);
        ctx.lineTo(screenX + 16, screenY + 6);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 16, screenY - 9);
        ctx.lineTo(screenX - 16, screenY + 6);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#d0a080';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX - 18, screenY - 12);
        ctx.lineTo(screenX, screenY - 4);
        ctx.lineTo(screenX + 18, screenY - 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#b08060';
        ctx.beginPath();
        ctx.moveTo(screenX - 12, screenY - 10);
        ctx.lineTo(screenX - 14, screenY - 11);
        ctx.lineTo(screenX - 12, screenY - 8);
        ctx.lineTo(screenX - 10, screenY - 9);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#9a6a4a';
        ctx.beginPath();
        ctx.moveTo(screenX - 12, screenY + 8);
        ctx.lineTo(screenX - 10, screenY + 7);
        ctx.lineTo(screenX - 10, screenY + 10);
        ctx.lineTo(screenX - 12, screenY + 11);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(screenX + 4, screenY + 8);
        ctx.lineTo(screenX + 6, screenY + 7);
        ctx.lineTo(screenX + 6, screenY + 10);
        ctx.lineTo(screenX + 4, screenY + 11);
        ctx.closePath();
        ctx.fill();
    },

    castle: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#4a4a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 26);
        ctx.lineTo(screenX + 18, screenY - 17);
        ctx.lineTo(screenX + 18, screenY + 2);
        ctx.lineTo(screenX, screenY + 11);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a5a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 26);
        ctx.lineTo(screenX - 18, screenY - 17);
        ctx.lineTo(screenX - 18, screenY + 2);
        ctx.lineTo(screenX, screenY + 11);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a6a7a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 26);
        ctx.lineTo(screenX - 18, screenY - 17);
        ctx.lineTo(screenX, screenY - 8);
        ctx.lineTo(screenX + 18, screenY - 17);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a3a4a';
        ctx.beginPath();
        ctx.moveTo(screenX - 20, screenY - 32);
        ctx.lineTo(screenX - 17, screenY - 33.5);
        ctx.lineTo(screenX - 17, screenY - 26);
        ctx.lineTo(screenX - 20, screenY - 24.5);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(screenX - 3, screenY - 32);
        ctx.lineTo(screenX, screenY - 33.5);
        ctx.lineTo(screenX, screenY - 26);
        ctx.lineTo(screenX - 3, screenY - 24.5);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(screenX + 14, screenY - 32);
        ctx.lineTo(screenX + 17, screenY - 33.5);
        ctx.lineTo(screenX + 17, screenY - 26);
        ctx.lineTo(screenX + 14, screenY - 24.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a2a3a';
        ctx.beginPath();
        ctx.moveTo(screenX - 5, screenY - 2);
        ctx.lineTo(screenX - 8, screenY - 3.5);
        ctx.lineTo(screenX - 8, screenY + 4);
        ctx.lineTo(screenX - 5, screenY + 5.5);
        ctx.lineTo(screenX + 5, screenY + 1);
        ctx.lineTo(screenX + 5, screenY - 4);
        ctx.closePath();
        ctx.fill();
    },

    library: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 22);
        ctx.lineTo(screenX + 15, screenY - 15);
        ctx.lineTo(screenX + 15, screenY + 2);
        ctx.lineTo(screenX, screenY + 9);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 22);
        ctx.lineTo(screenX - 15, screenY - 15);
        ctx.lineTo(screenX - 15, screenY + 2);
        ctx.lineTo(screenX, screenY + 9);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a7a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 22);
        ctx.lineTo(screenX - 15, screenY - 15);
        ctx.lineTo(screenX, screenY - 8);
        ctx.lineTo(screenX + 15, screenY - 15);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a6a8a';
        for(let i = -10; i <= 10; i += 5) {
            ctx.beginPath();
            ctx.moveTo(screenX + i, screenY - 2);
            ctx.lineTo(screenX + i - 1, screenY - 2.5);
            ctx.lineTo(screenX + i - 1, screenY + 5);
            ctx.lineTo(screenX + i, screenY + 5.5);
            ctx.closePath();
            ctx.fill();
        }
    },

    university: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 24);
        ctx.lineTo(screenX + 16, screenY - 16);
        ctx.lineTo(screenX + 16, screenY + 2);
        ctx.lineTo(screenX, screenY + 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a7a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 24);
        ctx.lineTo(screenX - 16, screenY - 16);
        ctx.lineTo(screenX - 16, screenY + 2);
        ctx.lineTo(screenX, screenY + 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#9a8a7a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 24);
        ctx.lineTo(screenX - 16, screenY - 16);
        ctx.lineTo(screenX, screenY - 8);
        ctx.lineTo(screenX + 16, screenY - 16);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a4a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 32);
        ctx.lineTo(screenX - 8, screenY - 28);
        ctx.lineTo(screenX, screenY - 24);
        ctx.lineTo(screenX + 8, screenY - 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 32);
        ctx.lineTo(screenX - 8, screenY - 28);
        ctx.lineTo(screenX - 6, screenY - 26.5);
        ctx.lineTo(screenX, screenY - 29);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a7a9a';
        for(let i = -12; i <= 12; i += 6) {
            ctx.beginPath();
            ctx.moveTo(screenX + i, screenY - 4);
            ctx.lineTo(screenX + i - 1, screenY - 4.5);
            ctx.lineTo(screenX + i - 1, screenY + 5);
            ctx.lineTo(screenX + i, screenY + 5.5);
            ctx.closePath();
            ctx.fill();
        }
    },

    campfire: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.arc(screenX, screenY + 5, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 8);
        ctx.lineTo(screenX - 6, screenY + 2);
        ctx.lineTo(screenX - 2, screenY + 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 8);
        ctx.lineTo(screenX + 2, screenY + 2);
        ctx.lineTo(screenX + 6, screenY + 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 6, 4, 0, Math.PI * 2);
        ctx.fill();
    },

    tent: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#6d5d45';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX + 14, screenY - 9);
        ctx.lineTo(screenX + 14, screenY + 5);
        ctx.lineTo(screenX, screenY + 11);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8b7355';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX - 14, screenY - 9);
        ctx.lineTo(screenX - 14, screenY + 5);
        ctx.lineTo(screenX, screenY + 11);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#a68a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX - 14, screenY - 9);
        ctx.lineTo(screenX, screenY);
        ctx.lineTo(screenX + 14, screenY - 9);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a2a1a';
        ctx.beginPath();
        ctx.moveTo(screenX - 5, screenY + 3);
        ctx.lineTo(screenX - 8, screenY + 1.5);
        ctx.lineTo(screenX - 8, screenY + 8);
        ctx.lineTo(screenX - 5, screenY + 9.5);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#5a4a3a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX, screenY + 11);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(screenX - 14, screenY - 9);
        ctx.lineTo(screenX + 14, screenY - 9);
        ctx.stroke();
    },

    woodpile: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 10);
        ctx.lineTo(screenX + 10, screenY - 5);
        ctx.lineTo(screenX + 10, screenY + 3);
        ctx.lineTo(screenX, screenY + 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8b6914';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 10);
        ctx.lineTo(screenX - 10, screenY - 5);
        ctx.lineTo(screenX - 10, screenY + 3);
        ctx.lineTo(screenX, screenY + 8);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#4a3a1a';
        ctx.lineWidth = 2;
        for (let i = -8; i <= 8; i += 4) {
            ctx.beginPath();
            ctx.moveTo(screenX + i, screenY - 8);
            ctx.lineTo(screenX + i, screenY + 6);
            ctx.stroke();
        }
    },

    granary: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#d2b48c';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX + 16, screenY - 10);
        ctx.lineTo(screenX + 16, screenY + 6);
        ctx.lineTo(screenX, screenY + 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#c19a6b';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX - 16, screenY - 10);
        ctx.lineTo(screenX - 16, screenY + 6);
        ctx.lineTo(screenX, screenY + 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#daa520';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX - 16, screenY - 10);
        ctx.lineTo(screenX, screenY - 2);
        ctx.lineTo(screenX + 16, screenY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8b7355';
        ctx.fillRect(screenX - 4, screenY, 8, 10);
    },

    quarry: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX + 18, screenY - 8);
        ctx.lineTo(screenX + 18, screenY + 10);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 18, screenY - 8);
        ctx.lineTo(screenX - 18, screenY + 10);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#a9a9a9';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 18, screenY - 8);
        ctx.lineTo(screenX, screenY);
        ctx.lineTo(screenX + 18, screenY - 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#556b2f';
        ctx.fillRect(screenX - 6, screenY + 6, 12, 8);
    },

    monument: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#a0a0a0';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 25);
        ctx.lineTo(screenX + 8, screenY - 20);
        ctx.lineTo(screenX + 8, screenY + 8);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#c0c0c0';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 25);
        ctx.lineTo(screenX - 8, screenY - 20);
        ctx.lineTo(screenX - 8, screenY + 8);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#d3d3d3';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 25);
        ctx.lineTo(screenX - 8, screenY - 20);
        ctx.lineTo(screenX, screenY - 15);
        ctx.lineTo(screenX + 8, screenY - 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#708090';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 30);
        ctx.lineTo(screenX - 10, screenY - 25);
        ctx.lineTo(screenX, screenY - 20);
        ctx.lineTo(screenX + 10, screenY - 25);
        ctx.closePath();
        ctx.fill();
    },

    workshop: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#8b4513';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX + 14, screenY - 9);
        ctx.lineTo(screenX + 14, screenY + 6);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#a0522d';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 14, screenY - 9);
        ctx.lineTo(screenX - 14, screenY + 6);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#cd853f';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 14, screenY - 9);
        ctx.lineTo(screenX, screenY - 2);
        ctx.lineTo(screenX + 14, screenY - 9);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#696969';
        ctx.fillRect(screenX + 4, screenY - 4, 6, 8);
        ctx.fillRect(screenX - 10, screenY + 2, 6, 6);
    },

    aqueduct: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#708090';
        ctx.beginPath();
        ctx.moveTo(screenX - 20, screenY - 2);
        ctx.lineTo(screenX + 20, screenY - 2);
        ctx.lineTo(screenX + 20, screenY + 4);
        ctx.lineTo(screenX - 20, screenY + 4);
        ctx.closePath();
        ctx.fill();

        for (let i = -18; i <= 18; i += 12) {
            ctx.fillStyle = '#a9a9a9';
            ctx.beginPath();
            ctx.moveTo(screenX + i, screenY + 4);
            ctx.lineTo(screenX + i + 4, screenY + 6);
            ctx.lineTo(screenX + i + 4, screenY + 14);
            ctx.lineTo(screenX + i, screenY + 16);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#778899';
            ctx.beginPath();
            ctx.moveTo(screenX + i, screenY + 4);
            ctx.lineTo(screenX + i - 4, screenY + 6);
            ctx.lineTo(screenX + i - 4, screenY + 14);
            ctx.lineTo(screenX + i, screenY + 16);
            ctx.closePath();
            ctx.fill();
        }

        ctx.fillStyle = '#4682b4';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(screenX - 20, screenY - 4, 40, 4);
        ctx.globalAlpha = 1;
    },

    watchtower: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#8b7355';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 28);
        ctx.lineTo(screenX + 6, screenY - 25);
        ctx.lineTo(screenX + 6, screenY + 2);
        ctx.lineTo(screenX, screenY + 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#a0826d';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 28);
        ctx.lineTo(screenX - 6, screenY - 25);
        ctx.lineTo(screenX - 6, screenY + 2);
        ctx.lineTo(screenX, screenY + 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 32);
        ctx.lineTo(screenX - 10, screenY - 28);
        ctx.lineTo(screenX, screenY - 24);
        ctx.lineTo(screenX + 10, screenY - 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8b4513';
        ctx.fillRect(screenX - 3, screenY - 10, 6, 4);
    },

    cathedral: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#6a5a8a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 26);
        ctx.lineTo(screenX + 16, screenY - 18);
        ctx.lineTo(screenX + 16, screenY + 4);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a6a9a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 26);
        ctx.lineTo(screenX - 16, screenY - 18);
        ctx.lineTo(screenX - 16, screenY + 4);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a7aaa';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 26);
        ctx.lineTo(screenX - 16, screenY - 18);
        ctx.lineTo(screenX, screenY - 10);
        ctx.lineTo(screenX + 16, screenY - 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a3a6a';
        ctx.fillRect(screenX - 4, screenY - 36, 8, 12);
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 38, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#4169e1';
        ctx.fillRect(screenX - 4, screenY - 8, 8, 10);
    },

    townhall: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#b8860b';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 24);
        ctx.lineTo(screenX + 17, screenY - 16);
        ctx.lineTo(screenX + 17, screenY + 4);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#daa520';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 24);
        ctx.lineTo(screenX - 17, screenY - 16);
        ctx.lineTo(screenX - 17, screenY + 4);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 24);
        ctx.lineTo(screenX - 17, screenY - 16);
        ctx.lineTo(screenX, screenY - 8);
        ctx.lineTo(screenX + 17, screenY - 16);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8b4513';
        ctx.fillRect(screenX - 6, screenY - 2, 12, 10);

        ctx.fillStyle = '#4682b4';
        ctx.fillRect(screenX - 10, screenY - 12, 6, 6);
        ctx.fillRect(screenX + 4, screenY - 12, 6, 6);
    },

    arena: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#cd853f';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 14);
        ctx.lineTo(screenX + 22, screenY - 6);
        ctx.lineTo(screenX + 22, screenY + 10);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#deb887';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 14);
        ctx.lineTo(screenX - 22, screenY - 6);
        ctx.lineTo(screenX - 22, screenY + 10);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f5deb3';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + 4, 18, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#8b6914';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(screenX, screenY + 4, 18, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
    },

    hospital: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 17);
        ctx.lineTo(screenX + 15, screenY - 10);
        ctx.lineTo(screenX + 15, screenY + 5);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 17);
        ctx.lineTo(screenX - 15, screenY - 10);
        ctx.lineTo(screenX - 15, screenY + 5);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(screenX - 8, screenY - 6, 16, 4);
        ctx.fillRect(screenX - 2, screenY - 12, 4, 16);

        ctx.fillStyle = '#4682b4';
        ctx.fillRect(screenX - 10, screenY, 6, 6);
        ctx.fillRect(screenX + 4, screenY, 6, 6);
    },

    academy: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#4169e1';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX + 15, screenY - 11);
        ctx.lineTo(screenX + 15, screenY + 5);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6495ed';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX - 15, screenY - 11);
        ctx.lineTo(screenX - 15, screenY + 5);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#87ceeb';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX - 15, screenY - 11);
        ctx.lineTo(screenX, screenY - 4);
        ctx.lineTo(screenX + 15, screenY - 11);
        ctx.closePath();
        ctx.fill();

        for(let i = -12; i <= 12; i += 6) {
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(screenX + i - 2, screenY - 2, 4, 8);
        }
    },

    theater: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#8b008b';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 17);
        ctx.lineTo(screenX + 16, screenY - 10);
        ctx.lineTo(screenX + 16, screenY + 6);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#9932cc';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 17);
        ctx.lineTo(screenX - 16, screenY - 10);
        ctx.lineTo(screenX - 16, screenY + 6);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ba55d3';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 17);
        ctx.lineTo(screenX - 16, screenY - 10);
        ctx.lineTo(screenX, screenY - 3);
        ctx.lineTo(screenX + 16, screenY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(screenX - 6, screenY - 4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + 6, screenY - 4, 4, 0, Math.PI * 2);
        ctx.fill();
    },

    mansion: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 22);
        ctx.lineTo(screenX + 16, screenY - 14);
        ctx.lineTo(screenX + 16, screenY + 4);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffec8b';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 22);
        ctx.lineTo(screenX - 16, screenY - 14);
        ctx.lineTo(screenX - 16, screenY + 4);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff68f';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 22);
        ctx.lineTo(screenX - 16, screenY - 14);
        ctx.lineTo(screenX, screenY - 6);
        ctx.lineTo(screenX + 16, screenY - 14);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8b4513';
        ctx.fillRect(screenX - 4, screenY, 8, 10);

        for(let i = -12; i <= 12; i += 8) {
            ctx.fillStyle = '#4169e1';
            ctx.fillRect(screenX + i - 2, screenY - 8, 4, 6);
        }
    },

    spaceport: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#4a5a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX + 24, screenY - 10);
        ctx.lineTo(screenX + 24, screenY + 14);
        ctx.lineTo(screenX, screenY + 24);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a7a8a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX - 24, screenY - 10);
        ctx.lineTo(screenX - 24, screenY + 14);
        ctx.lineTo(screenX, screenY + 24);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a9aaa';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX - 24, screenY - 10);
        ctx.lineTo(screenX, screenY);
        ctx.lineTo(screenX + 24, screenY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a3a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 30);
        ctx.lineTo(screenX - 8, screenY - 26);
        ctx.lineTo(screenX - 8, screenY - 10);
        ctx.lineTo(screenX, screenY - 6);
        ctx.lineTo(screenX + 8, screenY - 10);
        ctx.lineTo(screenX + 8, screenY - 26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 6);
        ctx.lineTo(screenX - 6, screenY - 2);
        ctx.lineTo(screenX, screenY + 4);
        ctx.lineTo(screenX + 6, screenY - 2);
        ctx.closePath();
        ctx.fill();
    },

    laboratory: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#00ced1';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 17);
        ctx.lineTo(screenX + 15, screenY - 10);
        ctx.lineTo(screenX + 15, screenY + 6);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#20b2aa';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 17);
        ctx.lineTo(screenX - 15, screenY - 10);
        ctx.lineTo(screenX - 15, screenY + 6);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#48d1cc';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 17);
        ctx.lineTo(screenX - 15, screenY - 10);
        ctx.lineTo(screenX, screenY - 3);
        ctx.lineTo(screenX + 15, screenY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(screenX - 6, screenY - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + 6, screenY - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX, screenY + 4, 3, 0, Math.PI * 2);
        ctx.fill();
    },

    megafactory: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#2f4f4f';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX + 24, screenY - 6);
        ctx.lineTo(screenX + 24, screenY + 12);
        ctx.lineTo(screenX, screenY + 22);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a5f5f';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 24, screenY - 6);
        ctx.lineTo(screenX - 24, screenY + 12);
        ctx.lineTo(screenX, screenY + 22);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#708090';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 24, screenY - 6);
        ctx.lineTo(screenX, screenY + 4);
        ctx.lineTo(screenX + 24, screenY - 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(screenX - 6, screenY - 24, 5, 10);
        ctx.fillRect(screenX + 10, screenY - 20, 4, 8);
        ctx.fillRect(screenX - 14, screenY - 20, 4, 8);

        ctx.fillStyle = '#ff6600';
        ctx.fillRect(screenX - 4, screenY - 26, 2, 4);
        ctx.fillRect(screenX + 11, screenY - 22, 2, 4);
        ctx.fillRect(screenX - 12, screenY - 22, 2, 4);
    },

    observatory: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#425161';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 12);
        ctx.lineTo(screenX + 14, screenY - 4);
        ctx.lineTo(screenX + 14, screenY + 10);
        ctx.lineTo(screenX, screenY + 16);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#505f70';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 12);
        ctx.lineTo(screenX - 14, screenY - 4);
        ctx.lineTo(screenX - 14, screenY + 10);
        ctx.lineTo(screenX, screenY + 16);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2d3b49';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY - 18, 14, 7, 0, Math.PI, 0, true);
        ctx.lineTo(screenX - 14, screenY - 12);
        ctx.lineTo(screenX + 14, screenY - 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7c8ea4';
        ctx.beginPath();
        ctx.ellipse(screenX, screenY - 20, 14, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#95a7c0';
        ctx.beginPath();
        ctx.ellipse(screenX - 4, screenY - 23, 6, 4, -0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2b3744';
        ctx.beginPath();
        ctx.moveTo(screenX + 4, screenY - 22);
        ctx.lineTo(screenX + 12, screenY - 28);
        ctx.lineTo(screenX + 13, screenY - 25);
        ctx.lineTo(screenX + 6, screenY - 20);
        ctx.closePath();
        ctx.fill();
    },

    spaceship: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#5a6a7a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 30);
        ctx.lineTo(screenX + 15, screenY - 10);
        ctx.lineTo(screenX + 10, screenY + 10);
        ctx.lineTo(screenX - 10, screenY + 10);
        ctx.lineTo(screenX - 15, screenY - 10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a8a9a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 30);
        ctx.lineTo(screenX - 15, screenY - 10);
        ctx.lineTo(screenX - 10, screenY);
        ctx.lineTo(screenX, screenY - 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a4a5a';
        ctx.beginPath();
        ctx.arc(screenX - 5, screenY - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + 5, screenY - 5, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(screenX - 8, screenY + 10);
        ctx.lineTo(screenX - 6, screenY + 15);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(screenX + 8, screenY + 10);
        ctx.lineTo(screenX + 6, screenY + 15);
        ctx.stroke();
    },

    ruins: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 8);
        ctx.lineTo(screenX + 8, screenY - 4);
        ctx.lineTo(screenX + 8, screenY + 4);
        ctx.lineTo(screenX, screenY + 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a2a2a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 8);
        ctx.lineTo(screenX - 8, screenY - 4);
        ctx.lineTo(screenX - 8, screenY + 4);
        ctx.lineTo(screenX, screenY + 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(screenX - 3, screenY - 2, 6, 8);
        ctx.fillRect(screenX - 6, screenY + 2, 4, 4);
        ctx.fillRect(screenX + 2, screenY + 4, 4, 3);
    },

    shrine: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX + 10, screenY - 11);
        ctx.lineTo(screenX + 10, screenY + 1);
        ctx.lineTo(screenX, screenY + 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a7a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 10, screenY - 11);
        ctx.lineTo(screenX - 10, screenY + 1);
        ctx.lineTo(screenX, screenY + 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#9a8a7a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 16);
        ctx.lineTo(screenX - 10, screenY - 11);
        ctx.lineTo(screenX, screenY - 6);
        ctx.lineTo(screenX + 10, screenY - 11);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 19, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 22);
        ctx.lineTo(screenX, screenY - 16);
        ctx.stroke();
    },

    scriptorium: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#5a4a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX + 12, screenY - 12);
        ctx.lineTo(screenX + 12, screenY + 2);
        ctx.lineTo(screenX, screenY + 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX - 12, screenY - 12);
        ctx.lineTo(screenX - 12, screenY + 2);
        ctx.lineTo(screenX, screenY + 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 18);
        ctx.lineTo(screenX - 12, screenY - 12);
        ctx.lineTo(screenX, screenY - 6);
        ctx.lineTo(screenX + 12, screenY - 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8b6914';
        ctx.fillRect(screenX - 8, screenY - 4, 4, 6);
        ctx.fillRect(screenX + 4, screenY - 4, 4, 6);

        ctx.fillStyle = '#d4af37';
        ctx.fillRect(screenX - 7, screenY - 3, 2, 1);
        ctx.fillRect(screenX + 5, screenY - 3, 2, 1);
        ctx.fillRect(screenX - 7, screenY, 2, 1);
        ctx.fillRect(screenX + 5, screenY, 2, 1);
    },

    fusionreactor: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#2a3a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 44);
        ctx.lineTo(screenX + 24, screenY - 32);
        ctx.lineTo(screenX + 24, screenY + 12);
        ctx.lineTo(screenX, screenY + 24);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a4a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 44);
        ctx.lineTo(screenX - 24, screenY - 32);
        ctx.lineTo(screenX - 24, screenY + 12);
        ctx.lineTo(screenX, screenY + 24);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a5a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 44);
        ctx.lineTo(screenX - 24, screenY - 32);
        ctx.lineTo(screenX, screenY - 20);
        ctx.lineTo(screenX + 24, screenY - 32);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 8, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#88ffff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(screenX, screenY - 8, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.strokeStyle = '#00aaff';
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY - 8);
            ctx.lineTo(
                screenX + Math.cos(angle) * 18,
                screenY - 8 + Math.sin(angle) * 10
            );
            ctx.stroke();
        }
    },

    serverbank: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#1a2a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 40);
        ctx.lineTo(screenX + 22, screenY - 30);
        ctx.lineTo(screenX + 22, screenY + 10);
        ctx.lineTo(screenX, screenY + 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a3a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 40);
        ctx.lineTo(screenX - 22, screenY - 30);
        ctx.lineTo(screenX - 22, screenY + 10);
        ctx.lineTo(screenX, screenY + 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a4a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 40);
        ctx.lineTo(screenX - 22, screenY - 30);
        ctx.lineTo(screenX, screenY - 20);
        ctx.lineTo(screenX + 22, screenY - 30);
        ctx.closePath();
        ctx.fill();

        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 4; col++) {
                const x = screenX - 16 + col * 8;
                const y = screenY - 16 + row * 5;
                ctx.fillStyle = Math.random() > 0.3 ? '#00ff00' : '#003300';
                ctx.fillRect(x, y, 6, 3);
            }
        }
    },

    cybercafe: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#2a2a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 38);
        ctx.lineTo(screenX + 20, screenY - 28);
        ctx.lineTo(screenX + 20, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a3a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 38);
        ctx.lineTo(screenX - 20, screenY - 28);
        ctx.lineTo(screenX - 20, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a4a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 38);
        ctx.lineTo(screenX - 20, screenY - 28);
        ctx.lineTo(screenX, screenY - 18);
        ctx.lineTo(screenX + 20, screenY - 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#00ffff';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                const x = screenX - 12 + i * 8;
                const y = screenY - 8 + j * 10;
                ctx.fillRect(x, y, 6, 4);
            }
        }

        ctx.fillStyle = '#ff00ff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CAFE', screenX, screenY - 42);
    },

    datacenter: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#1a1a2a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 42);
        ctx.lineTo(screenX + 24, screenY - 30);
        ctx.lineTo(screenX + 24, screenY + 12);
        ctx.lineTo(screenX, screenY + 24);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a2a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 42);
        ctx.lineTo(screenX - 24, screenY - 30);
        ctx.lineTo(screenX - 24, screenY + 12);
        ctx.lineTo(screenX, screenY + 24);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a3a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 42);
        ctx.lineTo(screenX - 24, screenY - 30);
        ctx.lineTo(screenX, screenY - 18);
        ctx.lineTo(screenX + 24, screenY - 30);
        ctx.closePath();
        ctx.fill();

        for (let stack = 0; stack < 3; stack++) {
            for (let row = 0; row < 8; row++) {
                const x = screenX - 18 + stack * 12;
                const y = screenY - 14 + row * 4;
                ctx.fillStyle = Math.random() > 0.2 ? '#0088ff' : '#001144';
                ctx.fillRect(x, y, 10, 2);
            }
        }

        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - 20, screenY - 16, 40, 30);
    },

    subwaystation: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 36);
        ctx.lineTo(screenX + 20, screenY - 26);
        ctx.lineTo(screenX + 20, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a5a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 36);
        ctx.lineTo(screenX - 20, screenY - 26);
        ctx.lineTo(screenX - 20, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a6a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 36);
        ctx.lineTo(screenX - 20, screenY - 26);
        ctx.lineTo(screenX, screenY - 16);
        ctx.lineTo(screenX + 20, screenY - 26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(screenX - 8, screenY - 6, 16, 20);

        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(screenX - 6, screenY - 4, 12, 3);
        ctx.fillRect(screenX - 6, screenY + 2, 12, 3);
        ctx.fillRect(screenX - 6, screenY + 8, 12, 3);

        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('M', screenX, screenY - 40);
    },

    skyscraper: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#3a4a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 50);
        ctx.lineTo(screenX + 10, screenY - 45);
        ctx.lineTo(screenX + 10, screenY + 8);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a5a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 50);
        ctx.lineTo(screenX - 10, screenY - 45);
        ctx.lineTo(screenX - 10, screenY + 8);
        ctx.lineTo(screenX, screenY + 13);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a6a7a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 50);
        ctx.lineTo(screenX - 10, screenY - 45);
        ctx.lineTo(screenX, screenY - 40);
        ctx.lineTo(screenX + 10, screenY - 45);
        ctx.closePath();
        ctx.fill();

        for (let floor = 0; floor < 12; floor++) {
            const y = screenY - 42 + floor * 4;
            ctx.fillStyle = Math.random() > 0.3 ? '#ffff00' : '#333333';
            ctx.fillRect(screenX - 8, y, 3, 2);
            ctx.fillRect(screenX - 3, y, 3, 2);
            ctx.fillRect(screenX + 2, y, 3, 2);
            ctx.fillRect(screenX + 7, y, 3, 2);
        }

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(screenX - 1, screenY - 54, 2, 4);
    },

    powerplant: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 38);
        ctx.lineTo(screenX + 22, screenY - 28);
        ctx.lineTo(screenX + 22, screenY + 10);
        ctx.lineTo(screenX, screenY + 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 38);
        ctx.lineTo(screenX - 22, screenY - 28);
        ctx.lineTo(screenX - 22, screenY + 10);
        ctx.lineTo(screenX, screenY + 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a5a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 38);
        ctx.lineTo(screenX - 22, screenY - 28);
        ctx.lineTo(screenX, screenY - 18);
        ctx.lineTo(screenX + 22, screenY - 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(screenX - 6, screenY - 46, 5, 12);
        ctx.fillRect(screenX + 2, screenY - 44, 5, 10);
        ctx.fillRect(screenX - 14, screenY - 42, 5, 8);

        ctx.fillStyle = '#ffaa00';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(screenX - 5, screenY - 48, 3, 4);
        ctx.fillRect(screenX + 3, screenY - 46, 3, 4);
        ctx.fillRect(screenX - 13, screenY - 44, 3, 4);
        ctx.globalAlpha = 1;

        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - 16, screenY - 6, 32, 16);
    },

    gaslamp: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#3a3a3a';
        ctx.fillRect(screenX - 3, screenY - 2, 6, 18);

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(screenX - 4, screenY + 16, 8, 4);
        ctx.fillRect(screenX - 4, screenY - 6, 8, 4);

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(screenX - 6, screenY - 12, 12, 6);

        ctx.fillStyle = '#ffdd88';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(screenX, screenY - 9, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#ffaa44';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 9, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#5a5a5a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(screenX - 6, screenY - 12);
        ctx.lineTo(screenX - 8, screenY - 14);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(screenX + 6, screenY - 12);
        ctx.lineTo(screenX + 8, screenY - 14);
        ctx.stroke();
    },

    parliament: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 36);
        ctx.lineTo(screenX + 20, screenY - 26);
        ctx.lineTo(screenX + 20, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 36);
        ctx.lineTo(screenX - 20, screenY - 26);
        ctx.lineTo(screenX - 20, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a7a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 36);
        ctx.lineTo(screenX - 20, screenY - 26);
        ctx.lineTo(screenX, screenY - 16);
        ctx.lineTo(screenX + 20, screenY - 26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(screenX - 4, screenY - 44, 8, 10);

        ctx.fillStyle = '#b8860b';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 46, 5, 0, Math.PI * 2);
        ctx.fill();

        for (let i = -3; i <= 3; i++) {
            ctx.fillStyle = '#4a3a2a';
            ctx.fillRect(screenX + i * 5 - 1, screenY - 4, 2, 14);
        }

        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(screenX - 6, screenY + 2, 12, 10);
    },

    gasworks: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#4a4a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 34);
        ctx.lineTo(screenX + 18, screenY - 24);
        ctx.lineTo(screenX + 18, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 34);
        ctx.lineTo(screenX - 18, screenY - 24);
        ctx.lineTo(screenX - 18, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 34);
        ctx.lineTo(screenX - 18, screenY - 24);
        ctx.lineTo(screenX, screenY - 14);
        ctx.lineTo(screenX + 18, screenY - 24);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a3a2a';
        ctx.fillRect(screenX - 5, screenY - 42, 4, 10);
        ctx.fillRect(screenX + 2, screenY - 40, 4, 8);

        ctx.fillStyle = '#ffaa44';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(screenX - 4, screenY - 44, 2, 4);
        ctx.fillRect(screenX + 3, screenY - 42, 2, 4);
        ctx.globalAlpha = 1;

        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = '#6a5a4a';
            ctx.beginPath();
            ctx.arc(screenX - 12 + i * 12, screenY + 4, 6, 0, Math.PI);
            ctx.fill();
        }
    },

    clocktower: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 44);
        ctx.lineTo(screenX + 8, screenY - 40);
        ctx.lineTo(screenX + 8, screenY + 8);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 44);
        ctx.lineTo(screenX - 8, screenY - 40);
        ctx.lineTo(screenX - 8, screenY + 8);
        ctx.lineTo(screenX, screenY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8a7a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 44);
        ctx.lineTo(screenX - 8, screenY - 40);
        ctx.lineTo(screenX, screenY - 36);
        ctx.lineTo(screenX + 8, screenY - 40);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(screenX - 3, screenY - 52, 6, 10);

        ctx.strokeStyle = '#3a3a3a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(screenX, screenY - 20, 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#f0e68c';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 20, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX, screenY - 26);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 20);
        ctx.lineTo(screenX + 4, screenY - 20);
        ctx.stroke();
    },

    steamfactory: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 36);
        ctx.lineTo(screenX + 20, screenY - 26);
        ctx.lineTo(screenX + 20, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a5a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 36);
        ctx.lineTo(screenX - 20, screenY - 26);
        ctx.lineTo(screenX - 20, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a6a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 36);
        ctx.lineTo(screenX - 20, screenY - 26);
        ctx.lineTo(screenX, screenY - 16);
        ctx.lineTo(screenX + 20, screenY - 26);
        ctx.closePath();
        ctx.fill();

        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = '#3a3a3a';
            ctx.fillRect(screenX - 14 + i * 7, screenY - 44 + i * 2, 4, 12);
        }

        ctx.fillStyle = '#cccccc';
        ctx.globalAlpha = 0.7;
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(screenX - 14 + i * 7, screenY - 46 + i * 2, 4, 6);
        }
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#6a4a2a';
        ctx.fillRect(screenX - 12, screenY - 4, 24, 14);

        ctx.strokeStyle = '#8a6a4a';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - 12, screenY - 4, 24, 14);
    },

    coalplant: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 32);
        ctx.lineTo(screenX + 18, screenY - 22);
        ctx.lineTo(screenX + 18, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 32);
        ctx.lineTo(screenX - 18, screenY - 22);
        ctx.lineTo(screenX - 18, screenY + 8);
        ctx.lineTo(screenX, screenY + 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a5a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 32);
        ctx.lineTo(screenX - 18, screenY - 22);
        ctx.lineTo(screenX, screenY - 12);
        ctx.lineTo(screenX + 18, screenY - 22);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(screenX - 5, screenY - 40, 4, 10);
        ctx.fillRect(screenX + 2, screenY - 38, 4, 8);

        ctx.fillStyle = '#888888';
        ctx.globalAlpha = 0.6;
        ctx.fillRect(screenX - 4, screenY - 42, 3, 4);
        ctx.fillRect(screenX + 3, screenY - 40, 3, 4);
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(screenX - 12, screenY, 24, 12);

        ctx.fillStyle = '#ff6600';
        ctx.fillRect(screenX - 8, screenY + 2, 4, 6);
        ctx.fillRect(screenX + 4, screenY + 2, 4, 6);
    },

    trainstation: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#5a4a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 30);
        ctx.lineTo(screenX + 22, screenY - 18);
        ctx.lineTo(screenX + 22, screenY + 10);
        ctx.lineTo(screenX, screenY + 22);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a5a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 30);
        ctx.lineTo(screenX - 22, screenY - 18);
        ctx.lineTo(screenX - 22, screenY + 10);
        ctx.lineTo(screenX, screenY + 22);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7a6a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 30);
        ctx.lineTo(screenX - 22, screenY - 18);
        ctx.lineTo(screenX, screenY - 6);
        ctx.lineTo(screenX + 22, screenY - 18);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#3a3a3a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenX - 24, screenY + 12);
        ctx.lineTo(screenX + 24, screenY + 12);
        ctx.stroke();

        ctx.strokeStyle = '#2a2a2a';
        ctx.lineWidth = 2;
        for (let i = -20; i <= 20; i += 8) {
            ctx.beginPath();
            ctx.moveTo(screenX + i, screenY + 10);
            ctx.lineTo(screenX + i, screenY + 14);
            ctx.stroke();
        }

        ctx.fillStyle = '#8a6a4a';
        ctx.fillRect(screenX - 8, screenY - 14, 16, 20);

        ctx.fillStyle = '#4a6a8a';
        ctx.fillRect(screenX - 6, screenY - 10, 5, 6);
        ctx.fillRect(screenX + 1, screenY - 10, 5, 6);
    },

    ironworks: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 34);
        ctx.lineTo(screenX + 20, screenY - 24);
        ctx.lineTo(screenX + 20, screenY + 10);
        ctx.lineTo(screenX, screenY + 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a4a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 34);
        ctx.lineTo(screenX - 20, screenY - 24);
        ctx.lineTo(screenX - 20, screenY + 10);
        ctx.lineTo(screenX, screenY + 20);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#5a5a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 34);
        ctx.lineTo(screenX - 20, screenY - 24);
        ctx.lineTo(screenX, screenY - 14);
        ctx.lineTo(screenX + 20, screenY - 24);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(screenX - 6, screenY - 42, 5, 10);
        ctx.fillRect(screenX + 2, screenY - 40, 4, 8);

        ctx.fillStyle = '#ff6600';
        ctx.globalAlpha = 0.8;
        ctx.fillRect(screenX - 5, screenY - 44, 3, 4);
        ctx.fillRect(screenX + 3, screenY - 42, 3, 4);
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#6a4a2a';
        ctx.fillRect(screenX - 14, screenY - 6, 28, 18);

        this.ctx.fillStyle = '#ff8800';
        this.ctx.fillRect(screenX - 6, screenY, 12, 8);

        this.ctx.strokeStyle = '#8a6a4a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX - 14, screenY - 6, 28, 18);
    },

    ascensiongate: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#1a0a2a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 60);
        ctx.lineTo(screenX + 36, screenY - 46);
        ctx.lineTo(screenX + 36, screenY + 22);
        ctx.lineTo(screenX, screenY + 36);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a1a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 60);
        ctx.lineTo(screenX - 36, screenY - 46);
        ctx.lineTo(screenX - 36, screenY + 22);
        ctx.lineTo(screenX, screenY + 36);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a2a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 60);
        ctx.lineTo(screenX - 36, screenY - 46);
        ctx.lineTo(screenX, screenY - 32);
        ctx.lineTo(screenX + 36, screenY - 46);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#8800ff';
        ctx.fillRect(screenX - 10, screenY - 10, 20, 40);

        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 4;
        ctx.strokeRect(screenX - 10, screenY - 10, 20, 40);

        ctx.fillStyle = '#ffff00';
        ctx.globalAlpha = 0.8;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = screenX + Math.cos(angle) * 24;
            const y = screenY + 10 + Math.sin(angle) * 14;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    },

    matrixcore: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#0a0a1a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 56);
        ctx.lineTo(screenX + 34, screenY - 42);
        ctx.lineTo(screenX + 34, screenY + 20);
        ctx.lineTo(screenX, screenY + 34);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1a1a2a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 56);
        ctx.lineTo(screenX - 34, screenY - 42);
        ctx.lineTo(screenX - 34, screenY + 20);
        ctx.lineTo(screenX, screenY + 34);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a2a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 56);
        ctx.lineTo(screenX - 34, screenY - 42);
        ctx.lineTo(screenX, screenY - 28);
        ctx.lineTo(screenX + 34, screenY - 42);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#00ff00';
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < 12; i++) {
            const x = screenX - 30 + (i % 6) * 10;
            const y = screenY - 20 + Math.floor(i / 6) * 20;
            ctx.fillRect(x, y, 2, 12);
        }
        ctx.globalAlpha = 1;

        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - 16, screenY - 8, 32, 24);
    },

    dysonswarm: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#1a1a0a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 54);
        ctx.lineTo(screenX + 32, screenY - 40);
        ctx.lineTo(screenX + 32, screenY + 18);
        ctx.lineTo(screenX, screenY + 32);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a2a1a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 54);
        ctx.lineTo(screenX - 32, screenY - 40);
        ctx.lineTo(screenX - 32, screenY + 18);
        ctx.lineTo(screenX, screenY + 32);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 60, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffdd00';
        ctx.beginPath();
        ctx.arc(screenX, screenY - 60, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ff8800';
        ctx.lineWidth = 2;
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY - 60);
            ctx.lineTo(
                screenX + Math.cos(angle) * 28,
                screenY - 60 + Math.sin(angle) * 16
            );
            ctx.stroke();
        }
    },

    colonyship: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#3a4a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 50);
        ctx.lineTo(screenX + 28, screenY - 36);
        ctx.lineTo(screenX + 28, screenY + 16);
        ctx.lineTo(screenX, screenY + 30);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a5a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 50);
        ctx.lineTo(screenX - 28, screenY - 36);
        ctx.lineTo(screenX - 28, screenY + 16);
        ctx.lineTo(screenX, screenY + 30);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a3a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 54);
        ctx.lineTo(screenX - 10, screenY - 50);
        ctx.lineTo(screenX - 8, screenY - 40);
        ctx.lineTo(screenX, screenY - 44);
        ctx.lineTo(screenX + 8, screenY - 40);
        ctx.lineTo(screenX + 10, screenY - 50);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#6a7a8a';
        ctx.fillRect(screenX - 20, screenY - 10, 40, 20);
        ctx.fillRect(screenX - 6, screenY + 10, 12, 16);

        ctx.fillStyle = '#00ffff';
        ctx.fillRect(screenX - 16, screenY - 6, 8, 6);
        ctx.fillRect(screenX + 8, screenY - 6, 8, 6);
        ctx.fillRect(screenX - 4, screenY - 6, 8, 6);
    },

    terraformer: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#2a5a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 48);
        ctx.lineTo(screenX + 26, screenY - 34);
        ctx.lineTo(screenX + 26, screenY + 14);
        ctx.lineTo(screenX, screenY + 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a6a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 48);
        ctx.lineTo(screenX - 26, screenY - 34);
        ctx.lineTo(screenX - 26, screenY + 14);
        ctx.lineTo(screenX, screenY + 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a7a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 48);
        ctx.lineTo(screenX - 26, screenY - 34);
        ctx.lineTo(screenX, screenY - 20);
        ctx.lineTo(screenX + 26, screenY - 34);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(screenX, screenY - 52, 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#88ff88';
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY - 52);
            ctx.lineTo(
                screenX + Math.cos(angle) * 20,
                screenY - 52 + Math.sin(angle) * 12
            );
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    },

    warpgate: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#2a2a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 52);
        ctx.lineTo(screenX + 30, screenY - 38);
        ctx.lineTo(screenX + 30, screenY + 18);
        ctx.lineTo(screenX, screenY + 32);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a3a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 52);
        ctx.lineTo(screenX - 30, screenY - 38);
        ctx.lineTo(screenX - 30, screenY + 18);
        ctx.lineTo(screenX, screenY + 32);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#1a1a3a';
        ctx.fillRect(screenX - 8, screenY - 30, 16, 50);

        ctx.strokeStyle = '#8800ff';
        ctx.lineWidth = 4;
        ctx.strokeRect(screenX - 8, screenY - 30, 16, 50);

        ctx.fillStyle = '#00ffff';
        ctx.globalAlpha = 0.6;
        for (let y = -26; y < 18; y += 6) {
            ctx.fillRect(screenX - 6, screenY + y, 12, 2);
        }
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(screenX - 16, screenY - 34, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + 16, screenY - 34, 4, 0, Math.PI * 2);
        ctx.fill();
    },

    quantumlab: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#1a2a3a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 48);
        ctx.lineTo(screenX + 28, screenY - 36);
        ctx.lineTo(screenX + 28, screenY + 16);
        ctx.lineTo(screenX, screenY + 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#2a3a4a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 48);
        ctx.lineTo(screenX - 28, screenY - 36);
        ctx.lineTo(screenX - 28, screenY + 16);
        ctx.lineTo(screenX, screenY + 28);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3a4a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 48);
        ctx.lineTo(screenX - 28, screenY - 36);
        ctx.lineTo(screenX, screenY - 24);
        ctx.lineTo(screenX + 28, screenY - 36);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
            const x = screenX - 18 + i * 12;
            ctx.strokeRect(x, screenY - 16, 8, 20);
        }

        ctx.fillStyle = '#ff00ff';
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(screenX, screenY - 52, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY - 52);
            ctx.lineTo(
                screenX + Math.cos(angle) * 12,
                screenY - 52 + Math.sin(angle) * 12
            );
            ctx.stroke();
        }
    },

    orbitalring: function(ctx, screenX, screenY) {
        ctx.fillStyle = '#3a4a5a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 46);
        ctx.lineTo(screenX + 26, screenY - 34);
        ctx.lineTo(screenX + 26, screenY + 14);
        ctx.lineTo(screenX, screenY + 26);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#4a5a6a';
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - 46);
        ctx.lineTo(screenX - 26, screenY - 34);
        ctx.lineTo(screenX - 26, screenY + 14);
        ctx.lineTo(screenX, screenY + 26);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#6a7a8a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(screenX, screenY - 10, 24, 14, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#8a9aaa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(screenX, screenY - 10, 18, 10, 0, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = screenX + Math.cos(angle) * 24;
            const y = screenY - 10 + Math.sin(angle) * 14;
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};