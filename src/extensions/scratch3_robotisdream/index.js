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

/**
 * Enum for ROBOTIS DREAM protocol.
 * https://github.com/LLK/scratch-robotisdream-firmware/blob/master/protocol.md
 * @readonly
 * @enum {string}
 */
const BLEUUID = {
    service: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    writeChar: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    readChar: '6e400003-b5a3-f393-e0a9-e50e24dcca9e'
};

const INST_NONE = 0;
const INST_READ = 2;
const INST_WRITE = 3;

/**
 * A time interval to wait (in milliseconds) before reporting to the BLE socket
 * that data has stopped coming from the peripheral.
 */
const BLETimeout = 45000;

/**
 * A time interval to wait (in milliseconds) while a block that sends a BLE message is running.
 * @type {number}
 */
const BLESendInterval = 100;

/**
 * A string to report to the BLE socket when the ROBOTIS DREAM has stopped receiving data.
 * @type {string}
 */
const BLEDataStoppedError = 'ROBOTIS DREAM extension stopped receiving data';


/**
 * Manage communication with a RobotisDream peripheral over a Scrath Link client socket.
 */
class RobotisDream {

    /**
     * Construct a RobotisDream communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */
    constructor (runtime, extensionId) {

        /**
         * The Scratch 3.0 runtime used to trigger the green flag button.
         * @type {Runtime}
         * @private
         */
        this._runtime = runtime;

        /**
         * The BluetoothLowEnergy connection socket for reading/writing peripheral data.
         * @type {BLE}
         * @private
         */
        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);

        /**
         * The id of the extension this peripheral belongs to.
         */
        this._extensionId = extensionId;

        /**
         * Interval ID for data reading timeout.
         * @type {number}
         * @private
         */
        this._timeoutID = null;

        /**
         * A flag that is true while we are busy sending data to the BLE socket.
         * @type {boolean}
         * @private
         */
        this._busy = false;

        /**
         * ID for a timeout which is used to clear the busy flag if it has been
         * true for a long time.
         */
        this._busyTimeoutID = null;

         this.crc_table = [0x0000,
         		0x8005, 0x800F, 0x000A, 0x801B, 0x001E, 0x0014, 0x8011,
         		0x8033, 0x0036, 0x003C, 0x8039, 0x0028, 0x802D, 0x8027,
         		0x0022, 0x8063, 0x0066, 0x006C, 0x8069, 0x0078, 0x807D,
         		0x8077, 0x0072, 0x0050, 0x8055, 0x805F, 0x005A, 0x804B,
         		0x004E, 0x0044, 0x8041, 0x80C3, 0x00C6, 0x00CC, 0x80C9,
         		0x00D8, 0x80DD, 0x80D7, 0x00D2, 0x00F0, 0x80F5, 0x80FF,
         		0x00FA, 0x80EB, 0x00EE, 0x00E4, 0x80E1, 0x00A0, 0x80A5,
         		0x80AF, 0x00AA, 0x80BB, 0x00BE, 0x00B4, 0x80B1, 0x8093,
         		0x0096, 0x009C, 0x8099, 0x0088, 0x808D, 0x8087, 0x0082,
         		0x8183, 0x0186, 0x018C, 0x8189, 0x0198, 0x819D, 0x8197,
         		0x0192, 0x01B0, 0x81B5, 0x81BF, 0x01BA, 0x81AB, 0x01AE,
         		0x01A4, 0x81A1, 0x01E0, 0x81E5, 0x81EF, 0x01EA, 0x81FB,
         		0x01FE, 0x01F4, 0x81F1, 0x81D3, 0x01D6, 0x01DC, 0x81D9,
         		0x01C8, 0x81CD, 0x81C7, 0x01C2, 0x0140, 0x8145, 0x814F,
         		0x014A, 0x815B, 0x015E, 0x0154, 0x8151, 0x8173, 0x0176,
         		0x017C, 0x8179, 0x0168, 0x816D, 0x8167, 0x0162, 0x8123,
         		0x0126, 0x012C, 0x8129, 0x0138, 0x813D, 0x8137, 0x0132,
         		0x0110, 0x8115, 0x811F, 0x011A, 0x810B, 0x010E, 0x0104,
         		0x8101, 0x8303, 0x0306, 0x030C, 0x8309, 0x0318, 0x831D,
         		0x8317, 0x0312, 0x0330, 0x8335, 0x833F, 0x033A, 0x832B,
         		0x032E, 0x0324, 0x8321, 0x0360, 0x8365, 0x836F, 0x036A,
         		0x837B, 0x037E, 0x0374, 0x8371, 0x8353, 0x0356, 0x035C,
         		0x8359, 0x0348, 0x834D, 0x8347, 0x0342, 0x03C0, 0x83C5,
         		0x83CF, 0x03CA, 0x83DB, 0x03DE, 0x03D4, 0x83D1, 0x83F3,
         		0x03F6, 0x03FC, 0x83F9, 0x03E8, 0x83ED, 0x83E7, 0x03E2,
         		0x83A3, 0x03A6, 0x03AC, 0x83A9, 0x03B8, 0x83BD, 0x83B7,
         		0x03B2, 0x0390, 0x8395, 0x839F, 0x039A, 0x838B, 0x038E,
         		0x0384, 0x8381, 0x0280, 0x8285, 0x828F, 0x028A, 0x829B,
         		0x029E, 0x0294, 0x8291, 0x82B3, 0x02B6, 0x02BC, 0x82B9,
         		0x02A8, 0x82AD, 0x82A7, 0x02A2, 0x82E3, 0x02E6, 0x02EC,
         		0x82E9, 0x02F8, 0x82FD, 0x82F7, 0x02F2, 0x02D0, 0x82D5,
         		0x82DF, 0x02DA, 0x82CB, 0x02CE, 0x02C4, 0x82C1, 0x8243,
         		0x0246, 0x024C, 0x8249, 0x0258, 0x825D, 0x8257, 0x0252,
         		0x0270, 0x8275, 0x827F, 0x027A, 0x826B, 0x026E, 0x0264,
         		0x8261, 0x0220, 0x8225, 0x822F, 0x022A, 0x823B, 0x023E,
         		0x0234, 0x8231, 0x8213, 0x0216, 0x021C, 0x8219, 0x0208,
         		0x820D, 0x8207, 0x0202];


        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }

    writeBytePacket (id, address, value) {
      var packet = [];
      packet.push(0xff);
      packet.push(0xff);
      packet.push(0xfd);
      packet.push(0x00);
      packet.push(id);
      packet.push(0x06);
      packet.push(0x00);
      packet.push(INST_WRITE);
      packet.push(this.getLowByte(address));
      packet.push(this.getHighByte(address));
      packet.push(value);
       var crc = this.updateCRC(0, packet, packet.length);
       packet.push(this.getLowByte(crc));
       packet.push(this.getHighByte(crc));

       return packet;
    };

    writeWordPacket(id, address, value) {
   	var packet = [];
   	packet.push(0xff);
   	packet.push(0xff);
   	packet.push(0xfd);
   	packet.push(0x00);
   	packet.push(id);
   	packet.push(0x07);
   	packet.push(0x00);
   	packet.push(INST_WRITE);
   	packet.push(this.getLowByte(address));
   	packet.push(this.getHighByte(address));
   	packet.push(this.getLowByte(value));
   	packet.push(this.getHighByte(value));
       var crc = this.updateCRC(0, packet, packet.length);
       packet.push(this.getLowByte(crc));
       packet.push(this.getHighByte(crc));

       return packet;

    };

    getLowByte(a) {
   	return (a & 0xff);
    };

    getHighByte(a) {
   	return ((a >> 8) & 0xff);
    };

    updateCRC(crc_accum, data_blk_ptr, data_blk_size) {
   	var i, j;

   	for(j=0; j < data_blk_size; j++) {
   		i = ((crc_accum >> 8) ^ data_blk_ptr[j]) & 0xff;
   		crc_accum = (crc_accum << 8) ^ this.crc_table[i];
   	}

   	return crc_accum;
    };


    servoPower (port, direction, power){

      console.log("port: " + port + " / direction: " + direction + " / power: " + power);

      var d;
      var address;

      if(port==="port-3") { address = 152; }else if(port==="port-4"){ address = 154; }
      if(direction==="Clockwise") { d = 0; }else if(direction==="Counterclockwise"){ d = 1023; }
      if(power){
         power = 1023 * power / 100 + d;
      }

      console.log("servo power-2: address " + address +  " / power " + power);

      var packet = this.writeWordPacket(200, address, power);
      return this.send(BLEUUID.service, BLEUUID.writeChar, packet);
    }

    setSound (arg) {
      console.log("setSound : " + arg);
         var packet = this.writeBytePacket(200, 84, arg);
        return this.send(BLEUUID.service, BLEUUID.writeChar, packet);
    }


    /**
     * Called by the runtime when user wants to scan for a peripheral.
     */
    scan () {
        if (this._ble) {
            this._ble.disconnect();
        }
        console.log("scan..");

         let filters = [];
         filters.push({namePrefix: 'ROBOTIS'});

         let options = {};
         //options.acceptAllDevices = true;
         options.optionalServices = [BLEUUID.service];
         options.filters = filters;

        this._ble = new BLE(this._runtime, this._extensionId, options, this._onConnect, this.reset);
    }

    /**
     * Called by the runtime when user wants to connect to a certain peripheral.
     * @param {number} id - the id of the peripheral to connect to.
     */
    connect (id) {
        console.log("connect");
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    /**
     * Disconnect from the ROBOTIS DREAM.
     */
    disconnect () {
        console.log("disconnect");
        if (this._ble) {
            this._ble.disconnect();
        }
        this.reset();
    }

    /**
     * Reset all the state and timeout/interval ids.
     */
    reset () {
        console.log("reset");
        if (this._timeoutID) {
            window.clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }

    /**
     * Return true if connected to the ROBOTIS DREAM.
     * @return {boolean} - whether the ROBOTIS DREAM is connected.
     */
    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        console.log("Are u connected? " + connected);
        return connected;
    }

    /**
     * Send a message to the peripheral BLE socket.
     * @param {number} command - the BLE command hex.
     * @param {Uint8Array} message - the message to write
     */
    send (service, characteristic, value) {
        console.log("send service: " + service);
        console.log("send characteristic: " + characteristic);
        console.log("send value: " + value);

        if (!this.isConnected()) return;
        if (this._busy) return;

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        this._busy = true;

        // Set a timeout after which to reset the busy flag. This is used in case
        // a BLE message was sent for which we never received a response, because
        // e.g. the peripheral was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

        const data = Base64Util.uint8ArrayToBase64(value);

        this._ble.write(service, characteristic, data, 'base64', true).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }

    /**
     * Starts reading data from peripheral after BLE has connected to it.
     * @private
     */
    _onConnect () {

        this._ble.read(BLEUUID.service, BLEUUID.readChar, true, this._onMessage);
        this._timeoutID = window.setInterval(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

    /**
     * Process the sensor data from the incoming BLE characteristic.
     * @param {object} base64 - the incoming BLE data.
     * @private
     */
    _onMessage (base64) {
        // parse data
        const data = Base64Util.base64ToUint8Array(base64);
         //log.warn(data);

        // cancel disconnect timeout and start a new one
        window.clearTimeout(this._timeoutID);
        this._timeoutID = window.setInterval(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

}

/**
 * Scratch 3.0 blocks to interact with a RobotisDream peripheral.
 */
class Scratch3RobotisDreamBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return 'ROBOTIS DREAM';
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return 'robotisdream';
    }

    /**
     * Construct a set of RobotisDream blocks.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
        /**
         * The Scratch 3.0 runtime.
         * @type {Runtime}
         */
        this.runtime = runtime;

        // Create a new RobotisDream peripheral instance
        this._peripheral = new RobotisDream(this.runtime, Scratch3RobotisDreamBlocks.EXTENSION_ID);
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3RobotisDreamBlocks.EXTENSION_ID,
            name: Scratch3RobotisDreamBlocks.EXTENSION_NAME,
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: [
                {
                    opcode: 'servoPower',
                    text: formatMessage({
                        id: 'robotisdream.servoPower',
                        default: 'Servo [PORT] Direction [DIRECTION] Power [POWER]%',
                        description: 'move forward'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PORT: {
                            type: ArgumentType.STRING,
                            menu: 'PORT',
                            defaultValue: 'port-3'
                        },
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'DIRECTION',
                            defaultValue: 'Clockwise'
                        },
                        POWER: {
                            type: ArgumentType.STRING,
                            menu: 'POWER',
                            defaultValue: '50'
                        }
                    }
                },
                {
                    opcode: 'setSound',
                    text: formatMessage({
                        id: 'robotisdream.setSound',
                        default: 'Ring [DOREMI]',
                        description: 'ringing sound'
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DOREMI: {
                            type: ArgumentType.STRING,
                            menu: 'DOREMI',
                            defaultValue: '3'
                        }
                    }
                }
            ],
            menus: {
                PORT: {
                    acceptReporters: true,
                    items: ['port-3', 'port-4']
                },
                DIRECTION: {
                    acceptReporters: true,
                    items: ['Clockwise', 'Counterclockwise']
                },
                POWER: {
                    acceptReporters: true,
                    items: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100']
                },
                DOREMI:  [
                    {
                        text: formatMessage({
                            id: 'robotisdream.setsoundScale.do',
                            default: 'Do',
                            description: 'Do'
                        }),
                        value: '3'
                    },
                    {
                        text: formatMessage({
                            id: 'robotisdream.setsoundScale.re',
                            default: 'Re',
                            description: 'Re'
                        }),
                        value: '5'
                    },
                    {
                        text: formatMessage({
                            id: 'robotisdream.setsoundScale.mi',
                            default: 'Mi',
                            description: 'Mi'
                        }),
                        value: '7'
                    },
                ]
            }
        };
    }

    servoPower (args) {

        const power = parseInt(args.POWER);
        this._peripheral.servoPower(args.PORT, args.DIRECTION, power );

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
    }

    setSound (args) {
        this._peripheral.setSound(args.DOREMI);

        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 50);
        });
     }

}

module.exports = Scratch3RobotisDreamBlocks;
