/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Keybinding, KeybindingModifier, KeyCode, KeyCodeUtils, SimpleKeybinding } from 'vs/base/common/keyCodes';
import { OperatingSystem } from 'vs/base/common/platform';
import { BaseResolvedKeybinding } from 'vs/platform/keybinding/common/baseResolvedKeybinding';

/**
 * Do not instantiate. Use KeybindingService to get a ResolvedKeybinding seeded with information about the current kb layout.
 */
export class USLayoutResolvedKeybinding extends BaseResolvedKeybinding<SimpleKeybinding> {

	constructor(actual: Keybinding, os: OperatingSystem) {
		super(os, actual.parts);
	}

	private _keyCodeToUILabel(keyCode: KeyCode): string {
		if (this._os === OperatingSystem.Macintosh) {
			switch (keyCode) {
				case KeyCode.LeftArrow:
					return '←';
				case KeyCode.UpArrow:
					return '↑';
				case KeyCode.RightArrow:
					return '→';
				case KeyCode.DownArrow:
					return '↓';
			}
		}
		return KeyCodeUtils.toString(keyCode);
	}

	protected _getLabel(keybinding: SimpleKeybinding): string | null {
		if (keybinding.isDuplicateModifierCase()) {
			return '';
		}
		return this._keyCodeToUILabel(keybinding.keyCode);
	}

	protected _getAriaLabel(keybinding: SimpleKeybinding): string | null {
		if (keybinding.isDuplicateModifierCase()) {
			return '';
		}
		return KeyCodeUtils.toString(keybinding.keyCode);
	}

	protected _getElectronAccelerator(keybinding: SimpleKeybinding): string | null {
		return KeyCodeUtils.toElectronAccelerator(keybinding.keyCode);
	}

	protected _getUserSettingsLabel(keybinding: SimpleKeybinding): string | null {
		if (keybinding.isDuplicateModifierCase()) {
			return '';
		}
		const result = KeyCodeUtils.toUserSettingsUS(keybinding.keyCode);
		return (result ? result.toLowerCase() : result);
	}

	protected _isWYSIWYG(): boolean {
		return true;
	}

	protected _getDispatchPart(keybinding: SimpleKeybinding): string | null {
		return USLayoutResolvedKeybinding.getDispatchStr(keybinding);
	}

	public static getDispatchStr(keybinding: SimpleKeybinding): string | null {
		if (keybinding.isModifierKey()) {
			return null;
		}
		let result = '';

		if (keybinding.ctrlKey) {
			result += 'ctrl+';
		}
		if (keybinding.shiftKey) {
			result += 'shift+';
		}
		if (keybinding.altKey) {
			result += 'alt+';
		}
		if (keybinding.metaKey) {
			result += 'meta+';
		}
		result += KeyCodeUtils.toString(keybinding.keyCode);

		return result;
	}

	protected _getSingleModifierDispatchPart(keybinding: SimpleKeybinding): KeybindingModifier | null {
		if (keybinding.keyCode === KeyCode.Ctrl && !keybinding.shiftKey && !keybinding.altKey && !keybinding.metaKey) {
			return 'ctrl';
		}
		if (keybinding.keyCode === KeyCode.Shift && !keybinding.ctrlKey && !keybinding.altKey && !keybinding.metaKey) {
			return 'shift';
		}
		if (keybinding.keyCode === KeyCode.Alt && !keybinding.ctrlKey && !keybinding.shiftKey && !keybinding.metaKey) {
			return 'alt';
		}
		if (keybinding.keyCode === KeyCode.Meta && !keybinding.ctrlKey && !keybinding.shiftKey && !keybinding.altKey) {
			return 'meta';
		}
		return null;
	}
}
