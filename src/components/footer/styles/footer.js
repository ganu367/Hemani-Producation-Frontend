import styled from "styled-components/macro";
import { Link as ReactRouterLink } from "react-router-dom";

export const Container = styled.div( ({theme}) => `
    padding: 1.5rem;
    width: 100%;
    border-top: 3px solid ${theme.backgroundColor3};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    z-index: 1;
`);

export const Group = styled.div( ({theme}) => `
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    margin-bottom: 0.2rem;
`);

export const BigText = styled.div(({ theme }) => `
    white-space: nowrap;
    font-size: 1rem;
`);

export const Logo = styled.img(({ theme }) => `
    width: 5rem;
    margin-right: 0.5rem;
    border-radius: 0.2rem;
`);

export const Text = styled.div( ({theme,marginHorizontal}) => `
    font-size: 0.86rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: ${marginHorizontal ? "0 0.3rem" : "0"};
`);

export const Link = styled(ReactRouterLink)( ({theme}) => `
    color: ${theme.primaryColor2};
    text-decoration: none;
    transition: 0.3s ease all;
    font-weight: bold;

    &:hover
    {
        text-decoration: underline;
    }
`);