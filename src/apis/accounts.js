async function accounts (ctx, query) {
    const { type_id } = await ctx.mysql
        .select('type_id')
        .from('tagged_types')
        .where({ table_name: 'unit_details' })
        .first();
    //--- calling knex without a tableName is deprecated. Use knex.queryBuilder() instead.
    //--- Please note that above sql query is a test
    return {
        type_id
    }
}

export default accounts;