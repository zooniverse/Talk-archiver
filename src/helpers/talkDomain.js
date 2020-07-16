module.exports = function talkDomain({ bucket_path, name }) {
  switch (name) {
    case 'chimp': {
      return 'talk.chimpandsee.org'
    }
    case 'galaxy_zoo': {
      return 'talk.galaxyzoo.org'
    }
    case 'galaxy_zoo_starburst': {
      return 'quenchtalk.galaxyzoo.org'
    }
    case 'higgs_hunter': {
      return 'talk.higgshunters.org'
    }
    case 'radio': {
      return 'radiotalk.galaxyzoo.org'
    }
    default: {
      return bucket_path.replace('www.', 'talk.')
    }
  }
}