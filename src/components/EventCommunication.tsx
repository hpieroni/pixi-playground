import { useEffect, useRef, useState } from "react";
import {
  Application,
  Container,
  Sprite,
  InteractionEvent,
  TextStyle,
  Text,
} from "pixi.js";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { drawerWidth } from "./Layout";

interface PokemonSpec {
  name: string;
  height: number;
  weight: number;
  type: "fire" | "water" | "grass";
  abilities: string[];
}

const pokemonSpecs: Record<string, PokemonSpec> = {
  charmander: {
    name: "Charmander",
    type: "fire",
    height: 6,
    weight: 85,
    abilities: ["blaze", "solar-power"],
  },
  squirtle: {
    name: "Squirtle",
    type: "water",
    height: 5,
    weight: 90,
    abilities: ["bubble", "torrent"],
  },
  bulbasaur: {
    name: "Bulbasaur",
    type: "grass",
    height: 7,
    weight: 60,
    abilities: ["chlorophyll", "overgrow"],
  },
};

type PokemonName = "charmander" | "squirtle" | "bulbasaur";

class Pokedex {
  static get(name: PokemonName): Pokemon {
    return new Pokemon(name);
  }
}

const textStyle = new TextStyle({
  fill: "#ffffff",
  fontSize: 32,
});

class Pokemon extends Container {
  private sprite: Sprite;
  private text: Text;

  constructor(name: PokemonName) {
    super();

    this.name = name;
    this.sprite = Sprite.from(`pokemons/${name}.png`);
    this.sprite.scale.set(0.5);

    this.sprite.on("pointertap", this.onPointerTap, this);
    this.sprite.on("pointerover", this.onPointerOver, this);
    this.sprite.on("pointerout", this.onPointerOut, this);
    this.sprite.interactive = true;
    this.addChild(this.sprite);

    this.text = new Text(this.name, textStyle);
  }

  private onPointerTap(e: InteractionEvent): void {
    const clickedEvent = new CustomEvent("pokemon_clicked", {
      detail: { name: this.name },
    });
    window.dispatchEvent(clickedEvent);
  }

  private onPointerOver(e: InteractionEvent): void {
    this.text.x = this.width / 2;
    this.text.y = this.height;
    this.text.anchor.set(0.5, 0);
    this.addChild(this.text);
  }

  private onPointerOut(e: InteractionEvent): void {
    this.removeChild(this.text);
  }
}

function PokemonDetails({
  pokemonSpec,
  open = false,
  onClose,
}: {
  pokemonSpec?: PokemonSpec;
  open: boolean;
  onClose: () => void;
}) {
  const { name, type, height, weight, abilities } = pokemonSpec ?? {};

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 350,
        },
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box p={3}>
        <Typography variant="h3" mb={2}>
          {name}
        </Typography>
        <Box display="flex" justifyContent="space-between" textAlign="center">
          <div>
            <Typography variant="overline">Type</Typography>
            <Typography mb={2}>{type}</Typography>
          </div>
          <div>
            <Typography variant="overline">Height</Typography>
            <Typography mb={2}>{height}</Typography>
          </div>
          <div>
            <Typography variant="overline">Weight</Typography>
            <Typography mb={2}>{weight}</Typography>
          </div>
        </Box>
        <Typography variant="overline">Abilities</Typography>
        <Box component="ul" m={0}>
          {abilities?.map((ability) => (
            <li key={ability}>{ability}</li>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
}

function EventCommunication() {
  const containerRef = useRef<HTMLCanvasElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedPokemonSpec, setSelectedPokemonSpec] = useState<PokemonSpec>();

  useEffect(() => {
    const width = window.innerWidth - drawerWidth;
    const height = window.innerHeight;

    const app = new Application({
      view: containerRef?.current as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0x2c2c31,
      width,
      height,
    });

    const pokeContainer = new Container();

    const charmander = Pokedex.get("charmander");
    charmander.x = 0;
    charmander.y = 0;
    pokeContainer.addChild(charmander);

    const squirtle = Pokedex.get("squirtle");
    squirtle.x = 300;
    squirtle.y = 0;
    pokeContainer.addChild(squirtle);

    const bulbasaur = Pokedex.get("bulbasaur");
    bulbasaur.x = 600;
    bulbasaur.y = 0;
    pokeContainer.addChild(bulbasaur);

    app.stage.addChild(pokeContainer);

    return () => app.destroy();
  }, []);

  useEffect(() => {
    const handlePokemonClicked = (event: Event) => {
      const { name } = (event as CustomEvent).detail;
      setOpen(true);
      setSelectedPokemonSpec(pokemonSpecs[name]);
    };
    window.addEventListener("pokemon_clicked", handlePokemonClicked);

    return () =>
      window.removeEventListener("pokemon_clicked", handlePokemonClicked);
  }, []);

  return (
    <>
      <PokemonDetails
        pokemonSpec={selectedPokemonSpec}
        open={open}
        onClose={() => setOpen(false)}
      />
      <canvas ref={containerRef} />
    </>
  );
}

export default EventCommunication;
