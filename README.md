# rolesync
**[DreamFactory](http://www.dreamfactory.com) roles doc/deploy with command line interface**

**IMPORTANT** : *This project is in the development stage and is not yet recommended to use in your production environment.*

install:
`npm i -g dreamfactory-rolesync`

start new project:
`rolesync init`

create new role:
`rolesync create <name>`

generate local catalog of services from remote environment:
`rolesync catalog <env>`

generate humanized docs from remote environment:
`rolesync collect <env> [--password][--only][--force]`

validate local role doc structure:
`rolesync validate <env> [--only]`

check version:
`rolesync --version`

show all commands and options:
`rolesync --help`
