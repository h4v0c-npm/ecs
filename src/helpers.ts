export const FindLastIndexByKeyValue = (arr: any[], key: string, value: any) => {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i][key] === value)
            return i;
    }

    return -1;
};

export const FindFirstIndexByKeyValue = (arr: any[], key: string, value: any) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === value)
            return i;
    }

    return -1;
};
