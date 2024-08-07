import { useEffect, useState } from "react";
import axios from "axios";
import { Episode, Character } from "../types/type";
import "./CardUI.css";
import {
  Avatar,
  Box,
  Button,
  Card,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";

const CardUI = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [charactersList, setCharacters] = useState<Character[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);

  const [initialCharacter, setInitialCharacter] = useState<Character[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const charactersPerPage = 10;

  useEffect(() => {
    axios
      .get("https://rickandmortyapi.com/api/episode")
      .then((response) => {
        setEpisodes(response.data.results);
      })
      .catch((error) => console.error("Error fetching episodes:", error));
  }, [selectedEpisode?.id]);

  console.log("the selected episode are", selectedEpisode);

  const getAllCharacter = async () => {
    const characterResponse = await axios.get(
      "https://rickandmortyapi.com/api/character"
    );
    if (characterResponse) {
      console.log("Alist of characters", characterResponse?.data?.results);
      setInitialCharacter(characterResponse?.data?.results);
    }
  };

  useEffect(() => {
    getAllCharacter();
  }, []);

  useEffect(() => {
    if (selectedEpisode?.id !== null) {
      axios
        .get(
          `https://rickandmortyapi.com/api/character?episodeId=${selectedEpisode}`
        )
        .then((response) => {
          setCharacters(response.data.results);
        })
        .catch((error) => console.error("Error fetching characters:", error));
    } else if (selectedEpisode?.id == null) {
      setSelectedEpisode(null);
      setCharacters(initialCharacter);
    }
  }, [selectedEpisode?.id, initialCharacter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = selectedEpisode?.id
    ? charactersList.slice(indexOfFirstCharacter, indexOfLastCharacter)
    : initialCharacter.slice(indexOfFirstCharacter, indexOfLastCharacter);

  const shuffledCharacters = [...currentCharacters].sort(
    () => Math.random() - 0.5
  );

  return (
    <div className="episode-character-container">
      <aside className="episode-list">
        <Typography variant="h4">Episodes</Typography>
        <hr />
        <List>
          {episodes.map((episode) => (
            <ListItem
              key={episode.id}
              className={episode.id === selectedEpisode?.id ? "selected" : ""}
              onClick={() => {
                setSelectedEpisode(episode);
                setCurrentPage(1);
              }}
            >
              {episode.name}
            </ListItem>
          ))}
        </List>
      </aside>
      <main className="character-list" style={{ overflow: "hidden" }}>
        <Typography variant="h4">Characters</Typography>
        {selectedEpisode?.id === null ? (
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="start"
            gap={2}
            sx={{ mt: 3, ml: 3 }}
          >
            {currentCharacters.map((character: any) => (
              <Card
                key={character?.id}
                sx={{
                  textAlign: "center",
                  width: 150,
                  height: 150,
                }}
              >
                <Avatar
                  src={character?.image}
                  sx={{
                    width: 64,
                    height: 64,
                    mb: 2,
                    mt: 3,
                    ml: 5,
                  }}
                />

                <Tooltip title={character?.name}>
                  <Typography
                    sx={{
                      pb: 3,
                      mt: 3,
                      ml: 3,
                      width: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {character?.name}
                  </Typography>
                </Tooltip>
              </Card>
            ))}
          </Box>
        ) : (
          <>
            <Typography sx={{ textAlign: "center", mb: 3 }}>
              {`${
                selectedEpisode?.characters?.length == null
                  ? ""
                  : selectedEpisode?.characters?.length
              } Characters in episode  ${
                selectedEpisode?.name == null ? "" : selectedEpisode?.name
              }`}
            </Typography>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="start"
              gap={2}
              sx={{ mt: 3, ml: 3 }}
            >
              {shuffledCharacters.map((character: any) => (
                <Card
                  key={character?.id}
                  sx={{
                    textAlign: "center",
                    width: 150,
                    height: 150,
                  }}
                >
                  <Avatar
                    src={character?.image}
                    sx={{
                      width: 64,
                      height: 64,
                      mb: 2,
                      mt: 3,
                      ml: 5,
                    }}
                  />
                  <Tooltip title={character?.name}>
                    <Typography
                      sx={{
                        pb: 3,
                        mt: 3,
                        ml: 3,
                        width: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {character?.name}
                    </Typography>
                  </Tooltip>
                </Card>
              ))}
            </Box>
          </>
        )}
        <Box display="flex" justifyContent="center" sx={{ mt: 10 }}>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Typography variant="h6" sx={{ mx: 2 }}>
            {currentPage}
          </Typography>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={indexOfLastCharacter >= charactersList.length}
          >
            Next
          </Button>
        </Box>
      </main>
    </div>
  );
};

export default CardUI;
