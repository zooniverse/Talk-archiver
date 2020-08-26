#!/bin/bash

# list of all domains to modify convert to from ourboros talk to static page index.html
declare -a BAD_CHAR_TALK_DOMAINS=(
  "radiotalk.galaxyzoo.org"
  "talk.chicagowildlifewatch.org"
  "talk.diskdetective.org"
  "talk.galaxyzoo.org"
  "talk.planethunters.org"
  "talk.snapshotserengeti.org"
  "talk.wormwatchlab.org"
)

for domain in "${BAD_CHAR_TALK_DOMAINS[@]}"
do
  # currently only users path is known to be impacted
  PATH_PREFIX="s3://zooniverse-static/${domain}/users/"

  invalid_path_names=( $(aws s3 ls $PATH_PREFIX | awk '{print $2}' | grep '.\./$') )
  for invalid_path_name in "${invalid_path_names[@]}"
  do
    echo "Processing invalid path name: $invalid_path_name"
    path_prefix_to_rename=$PATH_PREFIX$invalid_path_name
    echo $path_prefix_to_rename

    valid_path_prefix=$(echo $invalid_path_name | pcregrep -o1 -i '^(.+?)\.+\/$')
    valid_path_suffix=$(echo $invalid_path_name | pcregrep -o2 -i '^(.+?)(\.+)\/$' | sed 's/./_/g')
    valid_path_name="$valid_path_prefix$valid_path_suffix"

    path_prefix_target="$PATH_PREFIX$valid_path_name/"
    echo $path_prefix_target
    # aws s3 --dryrun mv --recursive $path_prefix_to_rename $path_prefix_target
    aws s3 mv --recursive $path_prefix_to_rename $path_prefix_target
    echo
  done

  echo "${domain} talk site user pages converted to valid azure paths"
  echo "-----------------------------------------------"
  echo
done
