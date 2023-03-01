import { ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { DATA_TYPES, LOOKUP_FLAG, typeList } from '../../tools/types';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import NumbersIcon from '@mui/icons-material/Numbers';
import FlakyIcon from '@mui/icons-material/Flaky';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useEffect, useState } from 'react';

const Output = (props) => {
    const { inputs, output, params } = props;
    const [type, setType] = useState(output.type);
    const [name, setName] = useState(output.name);

    const icon = {};
    icon[DATA_TYPES.STRING] = <FormatQuoteIcon />;
    icon[DATA_TYPES.NUMBER] = <NumbersIcon />;
    icon[DATA_TYPES.BOOL] = <FlakyIcon />;
    icon[DATA_TYPES.ANY] = <QuestionMarkIcon />;

    useEffect(() => {
        if (output.type === DATA_TYPES.LOOKUP) {
            const lookup_input = inputs.find((i) => i.name === output.lookup);
            setType(lookup_input.type);

            // if (lookup_input.type !== DATA_TYPES.ANY) { TODO: if lookup is any?
            //     setType(lookup_input.type);
            // } else {
            //     const val = params[lookup_input.name];
            //     if (val === undefined) {
            //         setType(DATA_TYPES.ANY);
            //     } else {
            //         const t = typeof val;
            //         setType(typeList[t]);
            //     }
            // }
        }
    }, [inputs, output.lookup, params, output.type]);

    useEffect(() => {
        if (output.name.charAt(0) === LOOKUP_FLAG) {
            const lookup_name = params[output.name.substring(1)] ?? '';
            setName(lookup_name.length > 0 ? lookup_name : output.name);
        }
    }, [inputs, params[output.name.substring(1)], output.name]);

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>{icon[type]}</Avatar>
            </ListItemAvatar>
            <ListItemText>{name}</ListItemText>
            <ArrowForwardIcon />
        </ListItem>
    );
};

export default Output;
