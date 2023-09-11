import React from 'react';
import { Container, Table, Head, Body, Row, SpecialRow, Header, HeaderText, Data, DataText, JobStatusBox, AppStatusBox, Box, Icon, EmptyRow } from './styles/report-table';
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";

function ReportTable({children, ...restProps}) {
    return(
        <Container {...restProps}>
            <Table>
                {children}
            </Table>
        </Container>
    );
}

ReportTable.Head = function ReportTableHead({children, ...restProps}) {
    return (
        <Head {...restProps}>
            {children}
        </Head>
    );
}

ReportTable.Body = function ReportTableBody({children, ...restProps}) {
    return (
        <Body {...restProps}>
            {children}
        </Body>
    );
}

ReportTable.Row = function ReportTableRow({children, ...restProps}) {
    return (
        <Row {...restProps}>
            {children}
        </Row>
    );
}

ReportTable.SpecialRow = function ReportTableSpecialRow({children, ...restProps}) {
    return (
        <SpecialRow {...restProps}>
            {children}
        </SpecialRow>
    );
}

ReportTable.Header = function ReportTableHeader({children, last, ...restProps}) {
    return (
        <Header {...restProps}>
            <HeaderText last={last}>
                {children}
            </HeaderText>
        </Header>
    );
}

ReportTable.Data = function ReportTableData({children, arrow, textRight, ...restProps}) {
    return (
        <Data {...restProps} arrow={arrow} textRight={textRight}>
            <DataText textRight={textRight}>
                {arrow && arrow === "down" &&
                    <Icon>
                        <AiOutlineCaretDown />
                    </Icon>
                }
                {arrow && arrow === "up" && 
                    <Icon>
                        <AiOutlineCaretUp />
                    </Icon>
                }
                {children}
            </DataText>
        </Data>
    );
}

ReportTable.JobStatusBox = function ReportTableJobStatusBox({children, ...restProps}) {
    return (
        <JobStatusBox {...restProps}>
            {children}
        </JobStatusBox>
    );
}

ReportTable.AppStatusBox = function ReportTableAppStatusBox({children, ...restProps}) {
    return (
        <AppStatusBox {...restProps}>
            {children}
        </AppStatusBox>
    );
}

ReportTable.Box = function ReportTableBox({children, ...restProps}) {
    return (
        <Box {...restProps}>
            {children}
        </Box>
    );
}

ReportTable.EmptyRow = function ReportTableEmptyRow({children, ...restProps}) {
    return (
        <EmptyRow {...restProps}>
            <Table>
                {children}
            </Table>
        </EmptyRow>
    );
}

export default ReportTable;