function handleInput(str) {
    let input = str;
    input = input.toLowerCase();
    let formattedInput = "";
    let countConsecutiveSpaces = 0
    for(let i = 0; i < input.length; i++)
    {
        const chr = input.charAt(i)
        if(chr === ' ')
        {
            countConsecutiveSpaces++
            if(countConsecutiveSpaces < 2)
                formattedInput += chr    
        }
        else if(chr >= 'a' && chr <= 'z')
        {
            formattedInput += chr
            countConsecutiveSpaces = 0;
        }
    }
    formattedInput = formattedInput.trim();
    return formattedInput;
}

export {handleInput}