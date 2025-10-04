import mongoose, { Schema, InferSchemaType, Model } from 'mongoose';

// Bind to the real collection name you showed in Atlas (BeyondBlue)
const PlanetSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },

    pl_name: { type: String },     // "BD+20 594 b"
    hostname: { type: String },    // "BD+20 594"
    default_flag: { type: Number },            // 0
    disposition: { type: String }, // "CONFIRMED"
    disp_refname: { type: String },// "Espinoza et al. 2016"
    sy_snum: { type: Number },                 // 1
    sy_pnum: { type: Number },                 // 1
    discoverymethod: { type: String }, // "Transit"
    disc_year: { type: Number },               // 2016
    disc_facility: { type: String },   // "K2"
    soltype: { type: String },     // "Published Confirmed"
    pl_controv_flag: { type: Number },         // 0
    pl_refname: { type: String },  // HTML anchor string
    pl_orbper: { type: Number },
    pl_orbpererr1: { type: Number },
    pl_orbpererr2: { type: Number },
    pl_orbperlim: { type: Number },
    pl_rade: { type: Number },
    pl_radeerr1: { type: Number },
    pl_radeerr2: { type: Number },
    pl_radelim: { type: Number },
    pl_radj: { type: Number },
    pl_radjerr1: { type: Number },
    pl_radjerr2: { type: Number },
    pl_radjlim: { type: Number },
    ttv_flag: { type: Number },

    st_refname: { type: String },
    st_teff: { type: Number },
    st_tefferr1: { type: Number },
    st_tefferr2: { type: Number },
    st_tefflim: { type: Number },
    st_rad: { type: Number },
    st_raderr1: { type: Number },
    st_raderr2: { type: Number },
    st_radlim: { type: Number },
    st_mass: { type: Number },
    st_masserr1: { type: Number },
    st_masserr2: { type: Number },
    st_masslim: { type: Number },
    st_met: { type: Number },
    st_meterr1: { type: Number },
    st_meterr2: { type: Number },
    st_metlim: { type: Number },
    st_metratio: { type: String }, // "[Fe/H]"
    st_logg: { type: Number },
    st_loggerr1: { type: Number },
    st_loggerr2: { type: Number },
    st_logglim: { type: Number },

    sy_refname: { type: String },

    // Coordinates & photometry
    rastr: { type: String },
    ra: { type: Number },
    decstr: { type: String },
    dec: { type: Number },

    sy_dist: { type: Number },
    sy_disterr1: { type: Number },
    sy_disterr2: { type: Number },

    sy_vmag: { type: Number },
    sy_vmagerr1: { type: Number },
    sy_vmagerr2: { type: Number },

    sy_kmag: { type: Number },
    sy_kmagerr1: { type: Number },
    sy_kmagerr2: { type: Number },

    sy_gaiamag: { type: Number },
    sy_gaiamagerr1: { type: Number },
    sy_gaiamagerr2: { type: Number },

    // Keep these EXACTLY as strings (no coercion)
    rowupdate: { type: String },   // "4/25/2018"
    pl_pubdate: { type: String },  // "2018-03"
    releasedate: { type: String }, // "2/15/2018"
  },
  { timestamps: false, collection: 'BeyondBlue' } // <-- important
);

// create a TS type from the schema
export type PlanetDoc = InferSchemaType<typeof PlanetSchema> & { _id: mongoose.Types.ObjectId };

// reuse existing model if hot-reloading with nodemon
export const Planet: Model<PlanetDoc> =
  mongoose.models.Planet || mongoose.model<PlanetDoc>('Planet', PlanetSchema, 'BeyondBlue');
