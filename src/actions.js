export function toggle_panel(name) {
    return {
      type: 'TOGGLE_PANEL',
      name
    };
}

export function change_translations(value) {
    return {
      type: 'CHANGE_TRANSLATIONS',
      value
    };
}

export function change_externals(value) {
    return {
      type: 'CHANGE_EXTERNALS',
      value
    };
}
