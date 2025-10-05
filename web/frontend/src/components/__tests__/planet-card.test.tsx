import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PlanetCard } from "@/components/planet-card";

const basePlanet = {
  _id: "abc123",
  pl_name: "Kepler-22 b",
  hostname: "Kepler-22",
  default_flag: 1,
  disposition: "CONFIRMED",
  disp_refname: "ref",
  sy_snum: 1,
  sy_pnum: 1,
  discoverymethod: "Transit",
  disc_year: 2011,
  disc_facility: "Kepler",
  soltype: "Published Confirmed",
  pl_controv_flag: 0,
  pl_refname: "ref",
  pl_orbper: 289.8623,
  pl_orbpererr1: 0,
  pl_orbpererr2: 0,
  pl_orbperlim: 0,
  pl_rade: 2.4,
  pl_radeerr1: 0,
  pl_radeerr2: 0,
  pl_radelim: 0,
  pl_radj: 0,
  pl_radjerr1: 0,
  pl_radjerr2: 0,
  pl_radjlim: 0,
  ttv_flag: 0,
  st_refname: "",
  st_teff: 5500,
  st_tefferr1: 0,
  st_tefferr2: 0,
  st_tefflim: 0,
  st_rad: 0.9,
  st_raderr1: 0,
  st_raderr2: 0,
  st_radlim: 0,
  st_mass: 0.9,
  st_masserr1: 0,
  st_masserr2: 0,
  st_masslim: 0,
  st_met: 0,
  st_meterr1: 0,
  st_meterr2: 0,
  st_metlim: 0,
  st_metratio: "",
  st_logg: 4.4,
  st_loggerr1: 0,
  st_loggerr2: 0,
  st_logglim: 0,
  sy_refname: "",
  rastr: "",
  ra: 0,
  decstr: "",
  dec: 0,
  sy_dist: 200,
  sy_disterr1: 0,
  sy_disterr2: 0,
  sy_vmag: 0,
  sy_vmagerr1: 0,
  sy_vmagerr2: 0,
  sy_kmag: 0,
  sy_kmagerr1: 0,
  sy_kmagerr2: 0,
  sy_gaiamag: 0,
  sy_gaiamagerr1: 0,
  sy_gaiamagerr2: 0,
  rowupdate: "",
  pl_pubdate: "",
  releasedate: "",
} as any;

describe("PlanetCard", () => {
  it("renders planet name and host", () => {
    const { getByText } = render(<PlanetCard planet={basePlanet} />);
    expect(getByText("Kepler-22 b")).toBeInTheDocument();
    expect(getByText(/Host:/)).toBeInTheDocument();
  });

  it("shows representative image badge when no images provided", () => {
    const { getByText } = render(<PlanetCard planet={basePlanet} />);
    expect(getByText(/Representative image/i)).toBeInTheDocument();
  });
});
