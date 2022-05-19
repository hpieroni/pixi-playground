import { useEffect, useRef, useState } from "react";
import {
  Application,
  Container,
  Sprite,
  InteractionEvent,
  TextStyle,
  Text,
  Texture,
} from "pixi.js";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  MenuList,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { drawerWidth } from "./Layout";

interface PokemonSpec {
  name: string;
  type: string;
  height: number;
  weight: number;
  evolution?: PokemonName;
  abilities: string[];
}

type PokemonName =
  | "charmander"
  | "charizard"
  | "squirtle"
  | "blastoise"
  | "bulbasaur"
  | "venusaur";

const pokemonSpecs: Record<PokemonName, PokemonSpec> = {
  charmander: {
    name: "Charmander",
    type: "fire",
    height: 6,
    weight: 85,
    evolution: "charizard",
    abilities: ["blaze", "solar-power"],
  },
  charizard: {
    name: "Charizard",
    type: "fire / flying",
    height: 17,
    weight: 905,
    abilities: ["blaze", "solar-power"],
  },
  squirtle: {
    name: "Squirtle",
    type: "water",
    height: 5,
    weight: 90,
    evolution: "blastoise",
    abilities: ["bubble", "torrent"],
  },
  blastoise: {
    name: "Blastoise",
    type: "water",
    height: 16,
    weight: 855,
    abilities: ["torrent", "rain-dish"],
  },
  bulbasaur: {
    name: "Bulbasaur",
    type: "grass",
    height: 7,
    weight: 60,
    evolution: "venusaur",
    abilities: ["chlorophyll", "overgrow"],
  },
  venusaur: {
    name: "Venusaur",
    type: "grass / poison",
    height: 20,
    weight: 1000,
    abilities: ["chlorophyll", "overgrow"],
  },
};

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
  private gearIcon: Sprite;
  private text: Text;

  constructor(name: PokemonName) {
    super();

    this.name = name;
    this.text = new Text(this.name, textStyle);

    this.sprite = Sprite.from(`pokemons/${name}.png`);
    this.sprite.scale.set(0.5);

    this.sprite
      .on("pointertap", this.onPointerTap, this)
      .on("pointerover", this.onPointerOver, this)
      .on("pointerout", this.onPointerOut, this);

    this.sprite.interactive = true;
    this.sprite.buttonMode = true;
    this.addChild(this.sprite);

    this.gearIcon = Sprite.from("gear-icon.png");
    this.gearIcon.scale.set(0.2);
    this.gearIcon.on("pointertap", this.onGearTap, this);
    this.gearIcon.interactive = true;
    this.addChild(this.gearIcon);

    const handleEvolve = (event: Event) => {
      const { name } = (event as CustomEvent).detail;
      if (this.name === name) {
        this.evolve();
      }
    };
    window.addEventListener("evolve_pokemon", handleEvolve);
    const handleKill = (event: Event) => {
      const { name } = (event as CustomEvent).detail;
      if (this.name === name) {
        this.kill();
      }
    };
    window.addEventListener("kill_pokemon", handleKill);
    this.on("destroyed", () => {
      window.removeEventListener("evolve_pokemon", handleEvolve);
      window.removeEventListener("kill_pokemon", handleKill);
    });
  }

  private onPointerTap(e: InteractionEvent): void {
    const clickedEvent = new CustomEvent("select_pokemon", {
      detail: { name: this.name },
    });
    window.dispatchEvent(clickedEvent);
  }

  private onPointerOver(e: InteractionEvent): void {
    this.text.position.set(this.width / 2, this.height);
    this.text.anchor.set(0.5, 0);
    this.addChild(this.text);
  }

  private onPointerOut(e: InteractionEvent): void {
    this.removeChild(this.text);
  }

  private onGearTap(e: InteractionEvent): void {
    const clickedEvent = new CustomEvent("show_pokemon_menu", {
      detail: {
        name: this.name,
        position: {
          //@ts-ignore
          x: e.data.originalEvent.clientX,
          //@ts-ignore
          y: e.data.originalEvent.clientY,
        },
      },
    });
    window.dispatchEvent(clickedEvent);
  }

  public evolve() {
    const evolution = pokemonSpecs[this.name as PokemonName].evolution;
    if (evolution) {
      this.name = evolution;
      this.sprite.texture = Texture.from(`pokemons/${evolution}.png`);
    }
  }

  public kill() {
    this.destroy();
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
  const { name, type, height, weight, evolution, abilities } =
    pokemonSpec ?? {};

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
        <Typography variant="overline">Evolution</Typography>
        <Typography mb={2}>{evolution ?? "-"}</Typography>
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
  const [openSidePanel, setOpenSidePanel] = useState(false);
  const [selectedPokemonSpec, setSelectedPokemonSpec] = useState<PokemonSpec>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

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

    const pokemonContainer = new Container();
    pokemonContainer.position.set(50, 50);

    const charmander = Pokedex.get("charmander");
    charmander.position.set(0, 0);
    pokemonContainer.addChild(charmander);

    const squirtle = Pokedex.get("squirtle");
    squirtle.position.set(300, 0);
    pokemonContainer.addChild(squirtle);

    const bulbasaur = Pokedex.get("bulbasaur");
    bulbasaur.position.set(600, 0);
    pokemonContainer.addChild(bulbasaur);

    app.stage.addChild(pokemonContainer);

    return () => app.destroy(false, { children: true });
  }, []);

  useEffect(() => {
    const handleSelectPokemon = (event: Event) => {
      const { name } = (event as CustomEvent).detail;
      setOpenSidePanel(true);
      setSelectedPokemonSpec(pokemonSpecs[name as PokemonName]);
    };
    window.addEventListener("select_pokemon", handleSelectPokemon);

    const handleShowPokemonMenu = (event: Event) => {
      const { name, position } = (event as CustomEvent).detail;
      setMenuOpen(true);
      setMenuPosition(position);
      setSelectedPokemonSpec(pokemonSpecs[name as PokemonName]);
    };
    window.addEventListener("show_pokemon_menu", handleShowPokemonMenu);

    return () => {
      window.removeEventListener("show_pokemon_menu", handleSelectPokemon);
      window.removeEventListener("show_pokemon_menu", handleShowPokemonMenu);
    };
  }, []);

  const handleEvolve = () => {
    const clickedEvent = new CustomEvent("evolve_pokemon", {
      detail: { name: selectedPokemonSpec?.name?.toLowerCase() },
    });
    window.dispatchEvent(clickedEvent);
    setMenuOpen(false);
  };

  const handleKill = () => {
    const clickedEvent = new CustomEvent("kill_pokemon", {
      detail: { name: selectedPokemonSpec?.name?.toLowerCase() },
    });
    window.dispatchEvent(clickedEvent);
    setMenuOpen(false);
  };

  return (
    <>
      <PokemonDetails
        pokemonSpec={selectedPokemonSpec}
        open={openSidePanel}
        onClose={() => setOpenSidePanel(false)}
      />
      <Popover
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        anchorReference="anchorPosition"
        anchorPosition={{ left: menuPosition.x, top: menuPosition.y }}
      >
        <MenuList
          id="composition-menu"
          aria-labelledby="composition-button"
          onKeyDown={() => undefined}
        >
          <MenuItem onClick={handleEvolve}>Evolve</MenuItem>
          <MenuItem onClick={handleKill}>Kill</MenuItem>
        </MenuList>
      </Popover>
      <canvas ref={containerRef} />
    </>
  );
}

export default EventCommunication;
