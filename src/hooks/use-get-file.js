import { useAxiosPrivate, useAlert } from "./";

export default function useGetFile() {
    const axiosPrivate = useAxiosPrivate();
    const {setAlert} = useAlert();

    const getFile = async (path) => {
        // console.log(path);
        axiosPrivate.get("/api/utility/send-file", {params: {file_path: path}}, {responseType: "arraybuffer"})
        .then((response) => {
            // console.log(response?.data);
            return response?.data;
        })
        .then((base64str) => {
            const link = document.createElement('a');
            link.href = "data:application/octet-stream;base64," + base64str;
            link.setAttribute("download",path.substring(path.lastIndexOf('\\')+9));
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch((err) => {
            setAlert({msg: `Error: ${err?.message}`, type: "error"});
        });
    }

    return getFile;
}