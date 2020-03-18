const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

/**
 * Icon png to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = "data:image/png;base64,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";
const BLETimeout = 2500;
const BLEDataStoppedError = 'edubot extension stopped receiving data';

const BLEUUID = {
    motor_service:                 0xe005,
    misc_service:                  0xe006,
    sensor_service:                0xe007,
    char_sensor_all_data:         '34443c3f-3356-11e9-b210-d663bd873d93',
};

class EduBot {

    /**
     * Construct a EduBoyt communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor (runtime, extensionId) {
        this._runtime = runtime;

        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);
        this._extensionId = extensionId;

        this._timeoutID = null;
        this._busy = false;
        this._busyTimeoutID = null;

        this._robot_is_moving = 0;

        this._max_velocity = 300;

        this.disconnect = this.disconnect.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }


    get isRobotMoving() {
        if(this._robot_is_moving == 0)
            return false;
        else
            return true;
    }

    send (service, characteristic, value) {
        if (!this.isConnected()) return;
        if (this._busy) return;

        this._busy = true;
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

        const data = Base64Util.uint8ArrayToBase64(value);
        this._ble.write(service, characteristic, data, 'base64', false).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }

    scan () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                {services: [BLEUUID.motor_service, BLEUUID.misc_service, BLEUUID.sensor_service]}
            ]
        }, this._onConnect, this.disconnect);
    }

    connect (id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    disconnect () {
        window.clearInterval(this._timeoutID);
        if (this._ble) {
            this._ble.disconnect();
        }
    }

    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        return connected;
    }

    _onConnect () {
        this._ble.read(BLEUUID.sensor_service, BLEUUID.char_sensor_all_data, true, this._onMessage);
        this._timeoutID = window.setInterval(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

    _onMessage(base64) {
        const data = Base64Util.base64ToUint8Array(base64);

        this._robot_is_moving = data[0];

        // cancel disconnect timeout and start a new one
        window.clearInterval(this._timeoutID);
        this._timeoutID = window.setInterval(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }
}

/**
 * Scratch 3.0 blocks to interact with a Edubot peripheral.
 */
class Scratch3EduBotBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'EduBot';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'edubot';
    }

    /**
     * Construct a set of EduBot blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new EduBot peripheral instance
        this._peripheral = new EduBot(this.runtime, Scratch3EduBotBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3EduBotBlocks.EXTENSION_ID,
            name: Scratch3EduBotBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'moveForward',
                    text: formatMessage({
                        id: 'edubot.moveForward',
                        default: 'move forward',
                        description: 'move forward'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                },
                {
                    opcode: 'stopMoving',
                    text: formatMessage({
                        id: 'edubot.stop',
                        default: 'stop',
                        description: 'stop'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                    }
                },
                {
                    opcode: 'setVelocity',
                    text: formatMessage({
                        id: 'edubot.setVelocity',
                        default: 'move by velocity left [L_VEL] and right [R_VEL]',
                        description: 'move by step'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        L_VEL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        },
                        R_VEL: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },

            ],
            menus: {
            }
        };
    }

    setVelocity (args) {
        const l_vel = parseInt(args.L_VEL);
        const r_vel = parseInt(args.R_VEL);

        if(l_vel >= -300 && r_vel >= -300) {
            if(l_vel <= 300 && r_vel <= 300) {
                this._peripheral.setVelocity(l_vel, r_vel);
            }
        }
    }

    isRobotMoving (args) {
        return this._peripheral.isRobotMoving;
    }

    moveForward (args) {
        this._peripheral.setVelocity(this._peripheral._max_velocity, this._peripheral._max_velocity);
    }


    stopMoving (args) {
        this._peripheral.setVelocity(0, 0);
    }

}

module.exports = Scratch3EduBotBlocks;
