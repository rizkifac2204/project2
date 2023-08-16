import { useEffect, useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Wait from "components/GlobalComponents/Wait";
import CalegGrid from "./CalegGrid";
import CalegList from "./CalegList";
import { Typography } from "@mui/material";

const LIMIT = 8;

function CalegData({ utils, setUtils }) {
  const queryClient = useQueryClient();
  const targetRef = useRef(null);

  const {
    data: calegs,
    isError,
    isLoading,
    isFetching,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    enabled: !!utils.param,
    refetchOnWindowFocus: false,
    queryKey: ["calegs", "perpage", utils.param],
    queryFn: ({ pageParam = 0 }) =>
      axios
        .get(`/api/caleg/caleg-page`, {
          params: {
            jenis: utils.param,
            limit: LIMIT,
            page: pageParam,
            filter: utils.filter,
          },
        })
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response.data.message);
        }),
    getNextPageParam: (_lastPage, _pages) => {
      if (_lastPage.total > _pages.length * LIMIT) {
        return _pages.length;
      } else {
        return undefined;
      }
    },
  });

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axios.delete(`/api/caleg/${id}`);
        return res.data;
      } catch (err) {
        throw new Error(err?.response?.data?.message || "Terjadi Kesalahan");
      }
    },
    onSuccess: (data, variable, context) => {
      toast.success(data.message || "Sukses");
      setUtils((prev) => ({ ...prev, confirm: false, currentId: null }));
      queryClient.invalidateQueries(["calegs", utils.param]);
    },
    onError: (err, variables) => {
      setUtils((prev) => ({ ...prev, confirm: false, currentId: null }));
      toast.error(err.message);
    },
  });

  const handleDeleteClick = (id) => {
    setUtils((prev) => ({ ...prev, openConfirm: true, currentId: id }));
  };

  // hapus dengan cara melihat utils
  useEffect(() => {
    if (utils.confirm && utils.currentId && !utils.openConfirm)
      mutateDelete(utils.currentId);
  }, [utils.confirm, utils.currentId, utils.openConfirm]);

  // delay pencarian
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      // Panggil fungsi pencarian setelah pengguna selesai mengetik selama periode delay
      refetch();
    }, 500); // Ubah delay sesuai kebutuhan Anda (dalam milidetik)

    return () => {
      // Membersihkan timeout jika pengguna terus mengetik
      clearTimeout(delaySearch);
    };
  }, [utils.filter]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [targetRef, hasNextPage, fetchNextPage]);

  if (isLoading) return <Wait loading={isLoading} />;
  if (isError)
    return (
      <Alert
        sx={{ mt: 2 }}
        severity="error"
      >{`An error has occurred: ${error.message}`}</Alert>
    );

  return (
    <>
      <Box my={2} textAlign="center">
        <Typography color={"primary"} sx={{ fontWeight: "bold" }}>
          Total : {calegs?.pages[0]?.total}
        </Typography>
      </Box>

      {isFetching || isLoadingDelete ? (
        <LinearProgress sx={{ height: "4px", mt: "-4px" }} />
      ) : null}
      {calegs && calegs.pages[0].data.length === 0 ? (
        <Alert sx={{ mb: 2 }} severity="info">
          Data Tidak Ditemukan
        </Alert>
      ) : null}

      {utils.gridView && utils.gridView === true ? (
        <CalegGrid
          utils={utils}
          calegs={calegs}
          handleDeleteClick={handleDeleteClick}
        />
      ) : (
        <CalegList
          utils={utils}
          calegs={calegs}
          handleDeleteClick={handleDeleteClick}
        />
      )}

      <Box textAlign="center" py={3}>
        {isFetching || isFetchingNextPage ? (
          <>Loading ...</>
        ) : hasNextPage ? (
          <Button onClick={fetchNextPage}>
            <Box component="span" pr="5px" className="material-icons">
              autorenew
            </Box>
            Lebih Banyak
          </Button>
        ) : (
          <Button disabled>Sudah Semua</Button>
        )}
      </Box>

      <div ref={targetRef} />
    </>
  );
}

export default CalegData;
