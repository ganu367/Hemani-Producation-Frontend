import React from 'react';
import { Container, Line, ButtonGroup, Text, Title, Status } from './styles/grid';

function Grid({children, ...restProps}) {
    return(
        <Container {...restProps}>
            {children}
        </Container>
    );
}

Grid.Line = function GridLine({children, ...restProps}) {
    return (
        <Line {...restProps}>
            {children}
        </Line>
    );
}

Grid.ButtonGroup = function GridButtonGroup({children, ...restProps}) {
    return (
        <ButtonGroup {...restProps}>
            {children}
        </ButtonGroup>
    );
}

Grid.Text = function GridText({children, ...restProps}) {
    return (
        <Text {...restProps}>
            {children}
        </Text>
    );
}

Grid.Title = function GridTitle({children, ...restProps}) {
    return (
        <Title {...restProps}>
            {children}
        </Title>
    );
}

Grid.Status = function GridStatus({children, ...restProps}) {
    return (
        <Status {...restProps}>
            {children}
        </Status>
    );
}

export default Grid;