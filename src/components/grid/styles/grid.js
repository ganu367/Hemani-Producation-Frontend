import styled from "styled-components/macro";

export const Container = styled.div( ({theme, noPadding, minHeight}) => `
    padding: 1rem;
    box-sizing: border-box;
    width: 100%;
    min-height: ${minHeight ? minHeight : "75%"};
    border: ${ noPadding ? "none" : `3px solid ${theme.backgroundColor2}`};
    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background: ${theme.backgroundColor2};
`);

export const Title = styled.div( ({theme, colored}) => `
    color: ${ colored ? theme.primaryColor2 : theme.textColor1};
    font-size: 1.25rem;
    font-weight: bold;
    display: flex;
    width: 100%;
    justify-content: space-between;

    @media (max-width: 950px)
    {
        justify-content: center;
    }
`);

export const Line = styled.div( ({theme, noMarginTop}) => `
    background: ${theme.backgroundColor3};
    height: 0.15rem;
    width: 100%;
    border-radius: 0.5rem;
    margin: ${noMarginTop ? "0 0 1rem" : "1rem 0"};
`);

export const ButtonGroup = styled.div( ({theme,flexStart,flexEnd,center,marginBottom}) => `
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: ${flexStart ? "flex-start" : (flexEnd ? "flex-end" : "center")};
    align-items: center;
    margin-bottom: ${ marginBottom ? "1rem" : "0" };
`);

export const Text = styled.div( ({theme}) => `
    font-size: 1rem;
    padding: 0 0.5rem 0.5rem;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
`);


export const Status = styled.div( ({theme, status, marginTop}) => `
    margin-top: 0.25rem;
    padding: 0.33rem;
    width: 3.5rem;
    text-align: center;
    font-size: 0.9rem;
    height: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-transform: capitalize;
    border: 2px solid ${status === "withdrawn" ? `${theme.caution}a8` : status === "shortlisted" ? `${theme.caution}a8` : status === "open" ? `${theme.success}a8` : status === "closed" ? `${theme.danger}a8` : `${theme.info}a8`};
    background-color: ${status === "withdrawn" ? `${theme.caution}33` : status === "shortlisted" ? `${theme.caution}33` : status === "open" ? `${theme.success}33` : status === "closed" ? `${theme.danger}33` : `${theme.info}33`};
    border-radius: 0.5rem;
    color: ${theme.textColor1};
`);