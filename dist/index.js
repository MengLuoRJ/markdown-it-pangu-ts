"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pangu_ts_1 = __importDefault(require("pangu-ts"));
const utils_1 = require("markdown-it/lib/common/utils");
function getPrevChar(tokens, index) {
    let prevChar = '';
    for (let i = index - 1; i >= 0; i -= 1) {
        const { content, type } = tokens[i];
        if (type === 'html_inline') {
            break;
        }
        if (content && content.length) {
            prevChar = content.slice(-1);
            break;
        }
    }
    return prevChar;
}
exports.default = (md, options = {}) => {
    const { additionalRules = ['code_inline'] } = options;
    md.renderer.rules.text = (tokens, index, options, env, self) => {
        const prevChar = getPrevChar(tokens, index);
        return (0, utils_1.escapeHtml)(pangu_ts_1.default.spacing(prevChar + tokens[index].content).slice(prevChar.length));
    };
    additionalRules.forEach((type) => {
        const rule = md.renderer.rules[type];
        if (!rule) {
            return;
        }
        md.renderer.rules[type] = (tokens, index, options, env, self) => {
            let output = rule(tokens, index, options, env, self);
            if (output.length) {
                if (index > 0 && !(0, utils_1.isWhiteSpace)(output.charCodeAt(0))) {
                    output = ' ' + output;
                }
                if (index < tokens.length - 1 && !(0, utils_1.isWhiteSpace)(output.charCodeAt(output.length - 1))) {
                    output = output + ' ';
                }
            }
            return output;
        };
    });
};
