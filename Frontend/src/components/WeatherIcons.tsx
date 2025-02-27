interface IWmoInterpretation {
    color: string;
    description: string;
    icon: string;
}

const wmoInterpretation = ({ color, description, icon }: IWmoInterpretation): IWmoInterpretation => {
    color = color || '#9E9200';
    icon = `/icons/airy/${icon}@4x.png`;

    return {
        description,
        color,
        icon
    };
}

const weatherIcons: Record<number, IWmoInterpretation> = {
    0: wmoInterpretation({ color: '#F1F1F1', description: 'Céu limpo', icon: 'clear' }),

    1: wmoInterpretation({ color: '#E2E2E2', description: 'Predominantemente limpo', icon: 'mostly-clear' }),
    2: wmoInterpretation({ color: '#C6C6C6', description: 'Parcialmente nublado', icon: 'partly-cloudy' }),
    3: wmoInterpretation({ color: '#ABABAB', description: 'Nublado', icon: 'overcast' }),

    45: wmoInterpretation({ color: '#A4ACBA', description: 'Nevoeiro', icon: 'fog' }),
    48: wmoInterpretation({ color: '#8891A4', description: 'Nevoeiro gelado', icon: 'rime-fog' }),

    51: wmoInterpretation({ color: '#3DECEB', description: 'Garoa leve', icon: 'light-drizzle' }),
    53: wmoInterpretation({ color: '#0CCECE', description: 'Garoa', icon: 'moderate-drizzle' }),
    55: wmoInterpretation({ color: '#0AB1B1', description: 'Garoa intensa', icon: 'dense-drizzle' }),

    80: wmoInterpretation({ color: '#9BCCFD', description: 'Pancadas leves', icon: 'light-rain' }),
    81: wmoInterpretation({ color: '#51B4FF', description: 'Pancadas de chuva', icon: 'moderate-rain' }),
    82: wmoInterpretation({ color: '#029AE8', description: 'Pancadas fortes', icon: 'heavy-rain' }),

    61: wmoInterpretation({ color: '#BFC3FA', description: 'Chuva leve', icon: 'light-rain' }),
    63: wmoInterpretation({ color: '#9CA7FA', description: 'Chuva', icon: 'moderate-rain' }),
    65: wmoInterpretation({ color: '#748BF8', description: 'Chuva intensa', icon: 'heavy-rain' }),

    56: wmoInterpretation({ color: '#D3BFE8', description: 'Chuvisco congelante leve', icon: 'light-freezing-drizzle' }),
    57: wmoInterpretation({ color: '#A780D4', description: 'Chuvisco congelante', icon: 'dense-freezing-drizzle' }),

    66: wmoInterpretation({ color: '#CAC1EE', description: 'Chuva congelante leve', icon: 'light-freezing-rain' }),
    67: wmoInterpretation({ color: '#9486E1', description: 'Chuva congelante intensa', icon: 'heavy-freezing-rain' }),

    71: wmoInterpretation({ color: '#F9B1D8', description: 'Neve leve', icon: 'slight-snowfall' }),
    73: wmoInterpretation({ color: '#F983C7', description: 'Neve', icon: 'moderate-snowfall' }),
    75: wmoInterpretation({ color: '#F748B7', description: 'Nevasca', icon: 'heavy-snowfall' }),

    77: wmoInterpretation({ color: '#E7B6EE', description: 'Grãos de neve', icon: 'snowflake' }),

    85: wmoInterpretation({ color: '#E7B6EE', description: 'Pancadas de neve leves', icon: 'slight-snowfall' }),
    86: wmoInterpretation({ color: '#CD68E0', description: 'Pancadas de neve', icon: 'heavy-snowfall' }),

    95: wmoInterpretation({ color: '#525F7A', description: 'Tempestade', icon: 'thunderstorm' }),

    96: wmoInterpretation({ color: '#3D475C', description: 'Tempestade leve com granizo', icon: 'thunderstorm-with-hail' }),
    99: wmoInterpretation({ color: '#2A3140', description: 'Tempestade com granizo', icon: 'thunderstorm-with-hail' })
};

export default weatherIcons;